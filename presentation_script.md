# Pretext 발표 스크립트 정리

## 목차

1. pretext는 무엇인가
2-1. 웹 브라우저 렌더링 파이프라인
2-2. layout queuing 와 vsync
3. pretext의 실제 동작알아보기
3-1. 데모 1 : BasicMeasure — Cold/Hot Path 분리 성능 측정
3-2. 데모 2 : Accordion — DOM 측정 없는 무결점 아코디언 (Zero Reflow Height Transition)
3-3. 데모 3 : Streaming — LLM 토큰 스트리밍 & VSync 보호
3-4. 데모 4 : Grid — 가상 스크롤 레이아웃 캐싱 (10만 개 격자, 60fps 고정)
3-5. 데모 5 : ShapeFlow — 자유 형태 장애물 텍스트 래핑 (60fps 커서 라우팅)
4. 정리
5. Q&A


## 1. pretext는 무엇인가

(인사말 호호)

올해 초 쓰레드나 각종 피드에서 핫했던 pretext 라이브러리가 기억나서 발표를 준비해 봤는데요

(기사 + 피드 캡쳐)

이번에 발표를 준비하면서 pretext 라이브러리에 대해 알아보니

화려한 화면 연출용 라이브러리가 아닌 브라우저 렌더링 이슈를 뽀개보려고 했던 라이브러리 였더라구요

미드저니는 AI 이미지 + 영상 생성 기능을 제공하는 플랫폼인데, 

피드 형식의 무한스크롤 형태 구현과 

토큰입력시 해당 토큰 텍스트가 늘어날 때마다 토큰 입력 폼과 맞닿은 레이아웃 크기가 변경되는 구조의 화면들이 있더라구요 

아마 이런 화면들에서 발생하는 렌더링 성능 이슈를 해결하기 위해 pretext를 만든게 아닐까 싶었어요


## 2-1. 웹 브라우저 렌더링 파이프라인

구형 모델
1) Render Tree: DOM + CSSOM 결합 ➔ 화면 표시용 RenderTree 생성
2) Layout (Reflow): RenderObject 트리 순회 ➔ 좌표·크기 직접 수정(Mutable in-place)
3) Paint: 그래픽 컨텍스트 호출 ➔ 화면 버퍼에 픽셀 비트맵 직접 래스터화
4) Composite: 비트맵 레이어들 GPU 전송 ➔ Z-index 순서대로 화면 합성

현재 크롬 (Chromium / RenderingNG)
1) Style: CSS 파싱 + 연산 스타일(ComputedStyle) 매칭 ➔ Layout Tree 생성(순수 기하학 트리)  
2) Layout (LayoutNG): ConstraintSpace 순수 함수 모델 ➔ 불변 프래그먼트 트리(PhysicalBoxFragment) 생성  
3) Pre-Paint + Paint: 속성 트리(Property Trees) 빌드 + 그리기 명령어 버퍼(cc::PaintOpBuffer) 기록  
4) Commit / Composite: 컴포지터 스레드 커밋 + 백그라운드 래스터화 ➔ Viz 디스플레이 출력  

(https://developer.chrome.com/docs/chromium/renderingng-architecture?hl=ko)

현재 사파리 (WebKit / WebCore)
1) Style: CSS JIT 매칭 ➔ 연산 스타일 확정 및 RenderObject 트리 구성
2) Layout (LFC): 모던 LFC 엔진 ➔ 불변 박스 모델 기반 지오메트리 캐싱 연산
3) Geometry Mapping + Paint: 레이어 마스크·변형 사전 매핑 + DisplayList 직렬화 커맨드 기록
4) CoreAnimation Commit: WebContent 프로세스 Flush ➔ OS 네이티브 합성기(CoreAnimation / CALayer) 화면 출력

(https://docs.webkit.org/Deep%20Dive/Layout%20%26%20Rendering/DisplayTree.html)


## 2-2. layout queuing 와 vsync 그리고 layout thrashing

그럼 이번에는 브라우저가 실제로 화면을 그리는 타이밍이 어떻게 결정되는지 알아보겠습니다

### 1) VSync 신호 전달 흐름 (Chromium 기준)

```
디스플레이 하드웨어 (VSync 펄스 생성)
    │
    ▼
OS 디스플레이 서브시스템
    • macOS: CVDisplayLink / CoreAnimation
    • Windows: DWM (Desktop Window Manager)
    │
    ▼
Chromium GPU 프로세스 (Viz 서비스)
    • OS로부터 VSync 틱을 수신 => 여기서 틱 수신 간격이 (16.67ms: 60Hz / 8.33ms: 120Hz / 6.94ms: 144Hz)
    • 프레임 마감 시한(deadline) 계산
    • 렌더러에게 BeginFrame IPC 신호 전송
    │
    ▼
렌더러 프로세스: 컴포지터 스레드 (cc::Scheduler)
    • BeginImplFrame 실행
    • 메인 스레드 작업이 필요하면 BeginMainFrame 디스패치
    │
    ▼
렌더러 프로세스: 메인 스레드 (Blink)
    • requestAnimationFrame 콜백 실행
    • Style Recalc → Layout(LayoutNG) → Pre-Paint → Paint
    • 컴포지터 스레드로 Commit
```

### 2) Layout Queuing (지연 일괄 배치)

브라우저는 DOM/스타일 조작(Write)이 발생해도 즉시 레이아웃을 계산하지 않고 지연 대기열에 적재(Queueing)함.  

**더티 플래그 마킹 (Invalidation):**
JS가 요소의 스타일이나 DOM 구조를 변경하면 대상 노드에 SetNeedsStyleRecalc 또는 SetNeedsLayout 플래그(Dirty Bit)만 세팅하고 즉시 리턴함.  

**배치 처리 (Batching):**
수십~수백 번의 DOM 조작이 일어나더라도, 다음 VSync 신호(BeginMainFrame)가 도달할 때 단 한 번의 통합 패스로 모아서 스타일 재계산과 레이아웃을 일괄 실행함.  

**목적:**
하드웨어 주사율 주기 밖에서 발생하는 불필요한 중복 렌더링 연산을 원천 차단하여 메인 스레드 점유율을 보존함.  


### 3) Layout Thrashing (레이아웃 스래싱)   

JavaScript가 브라우저의 지연 일괄 최적화(Queuing)를 강제로 무력화할 때 메인 스레드가 마비되는 병목 현상.  

```
① 메커니즘 흐름
[1. DOM / 스타일 쓰기 API (Write)]
  ➔ 대상 노드에 SetNeedsStyleRecalc / SetNeedsLayout 더티 플래그 마킹 (Invalidation)
  • 작업: element.style.width / className / textContent / appendChild 등
      │
      ▼
[2. 기하학적 수치 조회 API (Read)]
  ➔ 브라우저: "더티 플래그로 인해 기하 정보가 무효화된 상태에서, 다음 VSync 턴을 기다리지 못하고 즉시 동기 레이아웃 실행"
  • 호출: element.offsetHeight / getBoundingClientRect() / scrollTop / getComputedStyle() 등
      │
      ▼
[3. 🔥 강제 동기 레이아웃 (Forced Synchronous Layout)]
  ➔ VSync 마감 시한을 무시하고 즉시 
    - Chromium/blink => C++ Document::UpdateStyleAndLayout()
    - WebKit/WebCore => C++ Document::updateLayoutIgnorePendingStylesheets()
  ➔ 메인 스레드 블로킹 발생 (Style Recalc ➔ Layout 즉시 동기 수행)
    - Chromium: LayoutNG 재계산 
    - WebKit: LFC 레이아웃 재계산
      │
      ▼
[4. 💥 레이아웃 스래싱 연쇄 폭발 (Layout Thrashing)]
  ➔ 루프 내 "DOM 수정(Write) ➔ 수치 읽기(Read)" 패턴 반복
  ➔ 1프레임(16.67ms: 60Hz / 8.33ms: 120Hz / 6.94ms: 144Hz) 안에서 수십~수백 번 강제 레이아웃 호출로 메인 스레드 마비 (심각한 Jank 유발)
```

② 더티 플래그(Write)와 레이아웃 트리거(Read)

**더티 플래그 대상 API 및 작업 (Write / 무효화)**
- element.style.width, element.style.height, element.style.padding, element.style.margin, element.style.border, element.style.top, element.style.left, element.style.display
- element.style.fontSize, element.style.fontFamily, element.style.lineHeight, element.style.whiteSpace, element.style.wordBreak
- element.className, element.classList.add(), element.classList.remove(), element.classList.toggle()
- element.setAttribute('class', ...), element.setAttribute('style', ...)
- element.appendChild(), element.removeChild(), element.insertBefore(), element.replaceChild(), element.remove()
- element.append(), element.prepend()
- element.textContent = '...', element.innerText = '...', element.innerHTML = '...'
- document.body.appendChild(), document.head.appendChild()
- window.resize 이벤트 발생 (뷰포트 크기 변경)
- 동적 <style> 태그 삽입 또는 CSSStyleSheet 규칙 조작

**레이아웃 트리거 (Read / 강제 플러시)**
- element.offsetHeight, element.offsetWidth, element.offsetTop, element.offsetLeft
- element.getBoundingClientRect(), element.getClientRects()
- element.scrollHeight, element.scrollWidth
- element.scrollTop, element.scrollLeft
- element.clientHeight, element.clientWidth, element.clientTop, element.clientLeft
- window.getComputedStyle(element) 하위 속성 접근시
- window.getSelection().getRangeAt(0).getBoundingClientRect()
- element.scrollIntoView()
- window.scrollTo(), window.scrollBy()
- window.scrollX, window.scrollY, window.pageXOffset, window.pageYOffset
- window.innerWidth, window.innerHeight

## 3-1. 데모 2의 최적화 기법

### BasicMeasure — Cold/Hot Path 분리 성능 측정

첫 번째 데모는 pretext의 핵심 구조인 **2-Phase Engine** 을 보여주는 데모에요

pretext는 텍스트 연산을 두 단계로 엄격하게 나눕니다

**Cold Path — `prepare()` 단계**:
- 텍스트가 바뀔 때만 딱 1회 실행되는 전처리에요
- `Intl.Segmenter` 로 텍스트를 유니코드 표준에 맞춰 단어/공백/글리프 단위로 쪼개고
- `OffscreenCanvas`의 `ctx.measureText()` 로 각 조각의 픽셀 너비를 측정해서 `widths: number[]` 배열에 캐싱해요
- 이 과정이 한번 끝나면 Canvas의 역할은 완전히 종료됩니다

**Hot Path — `layout()` 단계**:
- 컨테이너 너비가 바뀔 때마다 실행되는 실시간 연산이에요
- DOM 호출도 없고, Canvas 호출도 없고, 문자열 작업도 없어요
- 오직 숫자 배열을 순회하면서 `maxWidth` 를 넘는 지점을 찾아 줄바꿈하고, `줄 수 × lineHeight` 곱셈으로 높이를 뱉어내는 순수 산술 연산이에요
- 실행 시간이 약 **0.0002ms(0.2µs)** 밖에 안 걸려서 120Hz 애니메이션 프레임 안에서도 수백 개의 텍스트를 무감속으로 연산할 수 있어요

```tsx
// Cold Path: 텍스트가 바뀔 때만 1회 실행
const prepared = useMemo(() => prepare(text, FONT), [text])

// Hot Path: 너비가 바뀔 때마다 순수 산술 연산 (0.0002ms)
const contentWidth = Math.max(100, effectiveWidth - OVERHEAD_H)
const result = layout(prepared, contentWidth, LINE_HEIGHT)
const totalBoxHeight = result.height + OVERHEAD_V
```

데모에서는 슬라이더로 컨테이너 너비를 180px~650px까지 마구 조절할 수 있는데요

좌측에는 Pretext 방식(Reflow 0회, µs 단위 연산 시간), 우측에는 기존 DOM 방식(`offsetHeight` 역측정, ms 단위 비용)을 나란히 놓고 실시간 비교할 수 있어요

핵심 포인트는 — 너비를 아무리 격하게 흔들어도 `layout()` 은 숫자 덧셈만 하니까 프레임 드랍이 전혀 없다는 거에요

==============================

## 3-2. 데모 2의 최적화 기법

### Accordion — DOM 측정 없는 무결점 아코디언 (Zero Reflow Height Transition)

두 번째 데모는 웹 프론트엔드 개발자라면 누구나 한 번쯤 고통받았을 **아코디언 높이 애니메이션의 고질적인 난제** 를 Pretext로 우아하게 풀어낸 데모에요

보통 아코디언은 닫혀 있을 때 `height: 0` 이었다가, 클릭해서 열릴 때 부드러운 애니메이션(`transition: height 200ms ease`)으로 펼쳐져야 하잖아요

그런데 브라우저 CSS 표준 명세상 **`height: auto` 에는 CSS transition이 전혀 동작하지 않습니다!** 시작값 `0px` 에서 끝값 `auto` 로는 중간 수치 보간이 불가능하기 때문인데요

그래서 지금까지 웹 개발자들이 써온 대표적인 2가지 편법이 있었습니다:

1. **❌ CSS `max-height: 1000px` 트릭**:
   - 실제 높이를 모르니까 일단 넉넉하게 `max-height: 1000px` 같은 걸 주고 애니메이션을 돌리는 거에요
   - 이러면 실제 내용물이 80px밖에 안 되더라도 브라우저는 1000px을 기준으로 200ms를 쪼개기 때문에, **열릴 때는 휙 하고 너무 빠르게 열리고, 반대로 닫힐 때는 1000px에서 80px까지 내려오는 동안 화면에 아무 움직임도 없는 먹통(딜레이) 현상** 이 발생해요

2. **❌ JS `element.scrollHeight` 동기 측정 (Naive 방식)**:
   - 클릭하는 순간 JS로 요소를 열기 직전에 `element.scrollHeight` 나 `offsetHeight` 를 읽어서 인라인으로 `height = 80px` 처럼 꽂아주는 방식이에요
   - 하지만 앞서 2-2절에서 본 것처럼, 요소를 열려고 상태를 바꾸고 즉시 `scrollHeight` 를 읽는 순간 브라우저는 **강제 동기 레이아웃(Forced Synchronous Layout)** 을 터뜨립니다. 메인 스레드가 즉시 멈추고 레이아웃 트리를 동기식으로 다시 짜기 때문에 클릭 순간 프레임이 뚝 떨어지는 쟁크(Jank)가 생겨요

pretext는 공식 데모(`pages/demos/accordion.ts`)에서 이 문제를 이렇게 해결합니다:

```tsx
// 1. Cold Path: 텍스트 변경 시 1회만 prepare() 호출
const preparedMap = useMemo(() => {
  const map = new Map<string, PreparedText>()
  sections.forEach(s => map.set(s.id, prepare(s.text, FONT)))
  return map
}, [sections])

// 2. Hot Path: 너비 변경 시 순수 산술 연산으로 각 섹션 타겟 높이 사전 계산 (~0.2µs)
const heightsMap = useMemo(() => {
  const contentWidth = containerWidth - PADDING_X // 테두리 및 내부 패딩 차감
  const map = new Map<string, number>()
  sections.forEach(s => {
    const { height } = layout(preparedMap.get(s.id)!, contentWidth, LINE_HEIGHT)
    map.set(s.id, Math.ceil(height + PADDING_Y)) // 📐 줄바꿈 높이 + 상하 패딩
  })
  return map
}, [preparedMap, containerWidth])

// 3. JSX: DOM scrollHeight 조회 없이 정확한 픽셀 높이 주입으로 100% 매끄러운 transition
<div
  style={{
    height: isOpen ? `${targetHeight}px` : '0px',
    overflow: 'clip',
    transition: 'height 200ms cubic-bezier(0.4, 0, 0.2, 1)',
  }}
>
  <p>{section.text}</p>
</div>
```

핵심 포인트를 정리하면요:

1. **0 DOM Reflow**: 브라우저에게 `scrollHeight` 를 단 한 번도 묻지 않아요. `layout()` 이 순수 산술 연산으로 줄 수를 세고 `lineHeight` 와 패딩을 더해서 정확한 픽셀 높이를 도출하니까, 강제 동기 레이아웃이 정확히 0회입니다.
2. **완벽한 애니메이션 타이밍**: `max-height` 해킹과 달리 정확한 타겟 높이(e.g. `94px`)를 딱 맞춰 주기 때문에, 닫힐 때 멍때리는 딜레이도 없고 열릴 때 급발진하는 현상도 없이 항상 100% 균일하고 유려한 감속 곡선이 유지돼요.
3. **완전한 반응형**: 슬라이더로 컨테이너 너비를 줄이거나 브라우저 창 크기가 바뀌면, 실시간으로 텍스트 줄바꿈이 다시 일어나면서 목표 높이가 마이크로초(µs) 단위에 재계산됩니다. 창 크기를 줄이면서 아코디언을 열어도 텍스트가 잘리거나 넘치지 않아요.

데모에서는 컨테이너 너비 슬라이더 조절과 함께, `🚀 Pretext 모드 (Zero Reflow)` 와 `💥 기존 Naive 모드 (scrollHeight 측정)` 를 스위칭하며 클릭 시 발생하는 누적 강제 리플로우 횟수와 연산 소요 시간(µs)을 직접 눈으로 비교할 수 있게 되어 있습니다.

공식 pretext 문서에서도 이 데모를 **"Finally sane accordion (드디어 온전해진 아코디언)"** 이라고 부르는데요, CSS의 태생적 한계와 브라우저 렌더링 병목을 동시에 깨끗하게 풀어낸 가장 실무적인 예제 중 하나에요.

==============================

## 3-3. 데모 3의 최적화 기법

### Streaming — LLM 토큰 스트리밍 & VSync 보호

네 번째 데모는 AI 챗봇에서 토큰이 실시간으로 쏟아져 들어올 때 발생하는 **자동 스크롤 성능 문제** 를 해결하는 데모에요

LLM 챗봇 인터페이스에서 흔히 쓰는 패턴이 있죠

```javascript
// ❌ 안티패턴: 토큰 추가 후 scrollHeight 즉시 읽기
container.textContent += newToken          // Write → Dirty 플래그 세팅
container.scrollTop = container.scrollHeight  // Read → 강제 동기 레이아웃!
```

토큰이 1초에 30~50개 들어오면 그 횟수만큼 `scrollHeight` 조회가 발생하고, 매번 브라우저가 텍스트 줄바꿈을 처음부터 다시 계산해야 하니까 메인 스레드가 100% 잠식되어서 스크롤이고 클릭이고 전부 멈춰버려요

pretext는 이걸 이렇게 풀어냅니다

```tsx
// ✅ Pretext 패턴: DOM에 묻지 않고 높이를 산술 연산으로 도출
const prepared = prepare(currentText, FONT)
const { height } = layout(prepared, effectiveWidth, LINE_HEIGHT)
chatBoxRef.current.scrollTop = height  // scrollHeight 대신 계산된 높이 사용!
```

`scrollHeight` 를 읽는 대신 pretext가 계산한 높이로 직접 `scrollTop` 을 세팅하는 거에요. DOM에 기하학적 수치를 전혀 묻지 않으니까 Dirty 플래그 플러시가 발생하지 않고, VSync 프레임 예산(60Hz 기준 16.6ms, 120Hz 기준 8.3ms)을 안정적으로 방어할 수 있어요

데모에서는 `⚡ Pretext 모드 (Zero Reflow)` 와 `💥 기존 Naive 모드 (Forced Reflow)` 를 토글로 전환하면서, 토큰이 쏟아지는 중에 누적 강제 리플로우 횟수와 체감 프레임 드랍을 직접 비교할 수 있습니다. Naive 모드에서는 리플로우 발생 시 컨테이너 전체가 빨간색으로 점멸하는 것도 볼 수 있어요

==============================

## 3-4. tanstack infinite scroll에 pretext 적용하기 데모

### TanStack Virtual 무한스크롤 — 사전 계산 높이 100% 정밀 주입

마지막 데모이자 사실상 가장 실무에 가까운 데모인데요, 현업에서 많이 쓰는 **`@tanstack/react-virtual` 가상화 라이브러리** 와 pretext를 결합한 무한스크롤 피드에요

기존 TanStack Virtual의 가변 높이 가상화 방식을 먼저 볼게요

```tsx
// ❌ 기존 방식: estimateSize로 대충 추정 후 measureElement로 DOM 역측정
const virtualizer = useVirtualizer({
  count: items.length,
  getScrollElement: () => scrollRef.current,
  estimateSize: () => 140, // 대략적인 추정값 (부정확!)
  measureElement: (el) => el.getBoundingClientRect().height, // ← 리플로우 유발!
})
```

`estimateSize` 에 대충 140px 같은 추정값을 넣고, 실제 요소가 마운트되면 `measureElement` 로 `getBoundingClientRect().height` 를 읽어서 보정하는 구조에요

문제는 — 스크롤할 때마다 새 요소가 마운트되고, 그때마다 `getBoundingClientRect()` 가 호출되면서 동기 레이아웃이 터진다는 거에요. 거기에 추정값과 실제값의 차이 때문에 스크롤바가 덜컹거리는 지터(Jitter)도 발생하구요

pretext를 적용하면 이게 완전히 바뀝니다

```tsx
// ✅ Pretext 방식: 마운트 전 100% 정밀 높이 배열 사전 계산
const heights = new Float64Array(items.length)
for (let i = 0; i < items.length; i++) {
  const item = items[i]
  const imageHeight = Math.round(textWidth / item.aspectRatio)        // 이미지: 종횡비 나눗셈 (0ms)
  const { height: promptHeight } = layout(item.preparedPrompt, textWidth, LINE_HEIGHT) // 텍스트: Pretext (0.0002ms)
  heights[i] = FIXED_OVERHEAD + imageHeight + promptHeight             // 카드 전체 높이 확정
}

const virtualizer = useVirtualizer({
  count: items.length,
  getScrollElement: () => scrollRef.current,
  estimateSize: (index) => heights[index], // 💡 추정이 아니라 100% 정확한 값!
  // measureElement 자체가 없음! → 리플로우 0회!
  overscan: 5,
})
```

포인트를 정리하면요

1. **`estimateSize` 에 정확한 값 주입**: "추정(estimate)"이라는 이름이지만 pretext가 사전 계산한 1px 오차 없는 정밀 높이를 넣으니까 사실상 확정값이에요
2. **`measureElement` 완전 제거**: DOM 역측정 자체를 안 하니까 스크롤 중 리플로우가 정확히 0회에요
3. **`transform: translate3d(0, y, 0)` 로 GPU 합성 직행**: `top: Ypx` 대신 transform을 쓰면 메인 스레드의 Layout/Paint를 통째로 건너뛰고 컴포지터 스레드 → GPU로 바로 갈 수 있어요

```tsx
// GPU 합성 직행 렌더링
<div style={{
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: `${virtualRow.size}px`,
  transform: `translate3d(0, ${virtualRow.start}px, 0)`, // 🚀 GPU 레이어
}} />
```

데모에서는 4가지 메트릭을 실시간으로 보여줍니다:
- 총 피드 카드 수 (무한 스크롤로 500개까지 자동 로딩)
- 현재 마운트된 DOM 노드 수 (예: 6개 마운트 / 500개 전체 → 98% DOM 절감)
- Pretext 텍스트 높이 산출 시간 (전체 카드 대상 수십 µs)
- DOM 역측정 리플로우 횟수 (Pretext 모드: 0회 vs 비적용 모드: N회)

그리고 `🔥 연쇄 리플로우 스트레스 테스트` 버튼이 있어서, 15회 동안 DOM Write와 `offsetHeight` Read를 교차 강제 실행해서 메인 스레드 블로킹 시간과 프레임 드랍을 경고창으로 보여주기도 합니다

==============================

## 3-5. 데모 5의 최적화 기법

### ShapeFlow — 자유 형태 장애물 텍스트 래핑 (60fps 커서 라우팅)

다섯 번째 데모는 **원형 장애물을 피해서 텍스트가 물 흐르듯 양쪽으로 갈라져 배치되는** 데모에요

CSS에서 `float` 이나 `shape-outside` 를 쓰면 장애물의 한쪽 면으로만 텍스트를 흘릴 수 있거든요. 장애물 양쪽으로 동시에 텍스트를 채우는 건 원천적으로 불가능해요

pretext는 **커서 기반 라인 라우팅** 이라는 독특한 패턴으로 이걸 해결합니다

```tsx
let cursor: LayoutCursor = { segmentIndex: 0, graphemeIndex: 0 }
let lineTop = 14

while (lineTop + LINE_HEIGHT <= maxY) {
  // 1. 현재 라인 높이 밴드와 원형 장애물의 수평 침범 구간 계산
  const blocked = circleIntervalForBand(obstacleX, obstacleY, obstacleRadius, bandTop, bandBottom)
  
  // 2. 가용 폭에서 침범 구간을 제외한 좌/우 슬롯 분할
  const slots = carveTextLineSlots(baseInterval, blocked, minSlotWidth)

  // 3. 좌측 슬롯 → 우측 슬롯 순서로 커서를 넘기며 layoutNextLine 호출
  for (const slot of orderedSlots) {
    const line = layoutNextLine(prepared, cursor, slot.right - slot.left)
    resultLines.push({ text: line.text, x: slot.left, y: lineTop, width: line.width })
    
    // ⚡ 핵심: 좌측 슬롯 끝 커서가 우측 슬롯 시작 커서로 즉시 이어짐!
    cursor = line.end
  }
  lineTop += LINE_HEIGHT
}
```

**`layoutNextLine()`** 이란 — `prepareWithSegments()` 로 전처리된 텍스트를 한 줄씩 순차적으로 레이아웃하는 이터레이터 스타일 API인데요, 각 줄마다 서로 다른 너비를 줄 수 있어요. 이전 줄의 끝 커서(`line.end`)가 다음 줄의 시작 커서가 되면서 텍스트가 자연스럽게 이어지는 구조에요

**슬롯 분할(Slot Carving)** 이란 — 한 줄의 가용 공간에서 장애물이 차지하는 수평 구간을 빼면, 남은 영역이 좌/우 두 개의 슬롯으로 나뉘잖아요. 그 각각의 슬롯에 `layoutNextLine()` 을 호출하면서 커서를 넘기는 거에요

데모에서는 파란색 원형 장애물을 마우스로 직접 드래그할 수 있는데, 마구 휘저어도 완벽한 60fps로 텍스트가 재배치됩니다. CSS `shape-outside` 였으면 드래그할 때마다 인라인 포맷팅 컨텍스트(IFC) 전체를 무효화해서 프레임이 15fps 이하로 곤두박질칠 상황이에요



## 4. 정리

정리해보면요

**pretext가 만들어진 목적**: 브라우저에게 "이 텍스트 크기가 얼마야?" 라고 DOM을 통해 질문하던 방식에서 벗어나, 브라우저의 규칙을 파악해서 순수 자바스크립트 산술 연산으로 직접 계산하는 패러다임을 제시한 라이브러리입니다

**렌더링 파이프라인과 리플로우**: Rendering NG / LayoutNG로 레이아웃 자체는 빨라졌지만, `offsetHeight` 같은 API로 인한 강제 동기 레이아웃(Forced Synchronous Layout) 문제는 아키텍처 개선만으로는 해결되지 않습니다. 이걸 피하려면 애초에 DOM에 기하학적 수치를 묻지 않아야 해요

**pretext 동작 원리**: Cold Path(`prepare`)에서 OffscreenCanvas로 폰트 너비를 1회 측정해두고, Hot Path(`layout`)에서는 DOM도 Canvas도 건드리지 않는 순수 산술 연산으로 줄 수와 높이를 0.0002ms만에 뱉어냅니다. `줄바꿈 시뮬레이션 → 줄 수 × lineHeight = 높이` 라는 단순한 공식이에요

**TanStack 무한스크롤**: `estimateSize` 에 사전 계산된 정밀 높이를 주입하고 `measureElement` 를 완전히 제거하면 스크롤 중 리플로우 0회, `transform: translate3d` 로 GPU 합성 직행까지 달성할 수 있습니다


## 5. Q&A

감사합니다