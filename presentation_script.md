# Pretext 발표 스크립트 정리

## 목차

1. pretext는 무엇인가
2-1. 웹 브라우저 렌더링 파이프라인
2-2. layout queuing과 vsync 그리고 layout thrashing
3. pretext의 실제 동작 알아보기
3-1. 데모 1 : BasicMeasure — Cold/Hot Path 분리 성능 측정
3-2. 데모 2 : Accordion — DOM 측정 없는 무결점 아코디언 (Zero Reflow Height Transition)
3-3. 데모 3 : Streaming — LLM 토큰 스트리밍 & VSync 보호
3-4. 데모 4 : TanStack Virtual 무한스크롤 — 사전 계산 높이 100% 정밀 주입
3-5. 데모 5 : ShapeFlow — 자유 형태 장애물 텍스트 래핑 (60fps 커서 라우팅)
4. 정리
5. Q&A


## 1. pretext는 무엇인가

(발표 도입 및 배경 개요)

- **도입 배경**: 미드저니(Midjourney) 웹 플랫폼 엔지니어링 과정에서 개발된 텍스트 레이아웃 라이브러리.
- **핵심 개발 목적**:
  - 화면 연출용 애니메이션 라이브러리가 아닌 브라우저 렌더링 성능 병목 해소 목적.
  - React 코어 개발자 Sebastian Markbåge의 텍스트 레이아웃 연구(text-layout)를 바탕으로, ReasonML 창시자이자 미드저니 웹 플랫폼을 이끈 Cheng Lou가 설계.
- **주요 해결 대상 화면 구조**:
  - 수만 개 피드 형태의 가변 높이 무한 스크롤.
  - 실시간 토큰 입력 시 텍스트 증가에 따라 입력 폼 및 인접 레이아웃 크기가 실시간 변경되는 인터랙션.
  - 위 구조에서 발생하는 브라우저 레이아웃 연산 병목 및 메인 스레드 점유 문제 해결.


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

(참조: https://developer.chrome.com/docs/chromium/renderingng-architecture?hl=ko)

현재 사파리 (WebKit / WebCore)
1) Style: CSS JIT 매칭 ➔ 연산 스타일 확정 및 RenderObject 트리 구성
2) Layout (LFC): 모던 LFC 엔진 ➔ 불변 박스 모델 기반 지오메트리 캐싱 연산
3) Geometry Mapping + Paint: 레이어 마스크·변형 사전 매핑 + DisplayList 직렬화 커맨드 기록
4) CoreAnimation Commit: WebContent 프로세스 Flush ➔ OS 네이티브 합성기(CoreAnimation / CALayer) 화면 출력

(참조: https://docs.webkit.org/Deep%20Dive/Layout%20%26%20Rendering/DisplayTree.html)


## 2-2. layout queuing 와 vsync 그리고 layout thrashing

- 브라우저 렌더링 주기와 지연 일괄 배치 메커니즘, 강제 플러시 동작 원리 분석.

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
    • OS로부터 VSync 틱 수신 (16.67ms: 60Hz / 8.33ms: 120Hz / 6.94ms: 144Hz)
    • 프레임 마감 시한(deadline) 계산
    • 렌더러에게 BeginFrame IPC 신호 전송
    │
    ▼
렌더러 프로세스: 컴포지터 스레드 (cc::Scheduler)
    • BeginImplFrame 실행
    • 메인 스레드 작업 필요 시 BeginMainFrame 디스패치
    │
    ▼
렌더러 프로세스: 메인 스레드 (Blink)
    • requestAnimationFrame 콜백 실행
    • Style Recalc → Layout(LayoutNG) → Pre-Paint → Paint
    • 컴포지터 스레드로 Commit
```

### 2) Layout Queuing (지연 일괄 배치)

- 브라우저는 DOM/스타일 조작(Write) 발생 시 즉시 레이아웃을 계산하지 않고 지연 대기열에 적재(Queueing)함.

**더티 플래그 마킹 (Invalidation):**
- JS가 요소의 스타일이나 DOM 구조를 변경하면 대상 노드에 SetNeedsStyleRecalc 또는 SetNeedsLayout 플래그(Dirty Bit)만 세팅하고 즉시 리턴함.

**배치 처리 (Batching):**
- 수십~수백 번의 DOM 조작이 발생해도 다음 VSync 신호(BeginMainFrame) 도달 시 단 한 번의 통합 패스로 모아서 스타일 재계산과 레이아웃을 일괄 실행함.

**목적:**
- 하드웨어 주사율 주기 밖에서 발생하는 불필요한 중복 렌더링 연산을 원천 차단하여 메인 스레드 점유율을 보존함.


### 3) Layout Thrashing (레이아웃 스래싱)   

- JavaScript가 브라우저의 지연 일괄 최적화(Queuing)를 강제로 무력화할 때 메인 스레드가 마비되는 병목 현상.

```
① 메커니즘 흐름
[1. DOM / 스타일 쓰기 API (Write)]
  ➔ 대상 노드에 SetNeedsStyleRecalc / SetNeedsLayout 더티 플래그 마킹 (Invalidation)
  • 대상 작업: element.style.width / className / textContent / appendChild 등
      │
      ▼
[2. 기하학적 수치 조회 API (Read)]
  ➔ 브라우저 동작: 기하 정보가 무효화된 상태에서 다음 VSync 턴을 대기하지 않고 즉시 동기 레이아웃 실행
  • 대상 호출: element.offsetHeight / getBoundingClientRect() / scrollTop / getComputedStyle() 등
      │
      ▼
[3. 🔥 강제 동기 레이아웃 (Forced Synchronous Layout)]
  ➔ VSync 마감 시한 무시 후 즉시 동기 실행:
    - Chromium/Blink: C++ Document::UpdateStyleAndLayout()
    - WebKit/WebCore: C++ Document::updateLayoutIgnorePendingStylesheets()
  ➔ 메인 스레드 블로킹 발생 (Style Recalc ➔ Layout 즉시 동기 수행)
    - Chromium: LayoutNG 재계산
    - WebKit: LFC 레이아웃 재계산
      │
      ▼
[4. 💥 레이아웃 스래싱 연쇄 폭발 (Layout Thrashing)]
  ➔ 루프 내 "DOM 수정(Write) ➔ 수치 읽기(Read)" 패턴 반복
  ➔ 1프레임(16.67ms: 60Hz / 8.33ms: 120Hz / 6.94ms: 144Hz) 내 수십~수백 회 강제 레이아웃 호출로 메인 스레드 마비 (심각한 Jank 유발)
```

**② 더티 플래그(Write)와 레이아웃 트리거(Read)**

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
- 동적 `<style>` 태그 삽입 또는 CSSStyleSheet 규칙 조작

**레이아웃 트리거 (Read / 강제 플러시)**
- element.offsetHeight, element.offsetWidth, element.offsetTop, element.offsetLeft
- element.getBoundingClientRect(), element.getClientRects()
- element.scrollHeight, element.scrollWidth
- element.scrollTop, element.scrollLeft
- element.clientHeight, element.clientWidth, element.clientTop, element.clientLeft
- window.getComputedStyle(element) 하위 속성 접근 시
- window.getSelection().getRangeAt(0).getBoundingClientRect()
- element.scrollIntoView()
- window.scrollTo(), window.scrollBy()
- window.scrollX, window.scrollY, window.pageXOffset, window.pageYOffset
- window.innerWidth, window.innerHeight


## 3-1. 데모 1 : BasicMeasure — Cold/Hot Path 분리 성능 측정

- pretext의 핵심 아키텍처인 **2-Phase Engine** 실증 데모.
- 텍스트 연산 단계를 Cold Path와 Hot Path로 엄격히 분리하여 처리함.

**Cold Path — `prepare()` 단계:**
- 텍스트 변경 시에만 1회 실행되는 전처리 단계.
- `Intl.Segmenter` 기반 유니코드 표준 분절 (단어/공백/글리프 단위 분리).
- `OffscreenCanvas`의 `ctx.measureText()`로 각 분절 조각의 픽셀 너비 측정 후 `widths: number[]` 배열에 캐싱.
- 측정 완료 후 Canvas 컨텍스트 참조 및 사용 종료.

**Hot Path — `layout()` 단계:**
- 컨테이너 너비 변경 시마다 실행되는 실시간 연산 단계.
- DOM 접근 0회, Canvas API 재호출 0회, 문자열 조작 0회.
- 사전 적재된 숫자 배열 순회: `maxWidth` 초과 지점 탐색 및 줄바꿈 산출, `줄 수 × lineHeight` 단순 곱셈으로 높이 계산.
- 실행 시간: 약 **0.0002ms (0.2µs)** 수준으로 120Hz 고주사율 프레임 예산 내 수백 개 텍스트 무감속 연산 가능.

```tsx
// Cold Path: 텍스트가 바뀔 때만 1회 실행
const prepared = useMemo(() => prepare(text, FONT), [text])

// Hot Path: 너비가 바뀔 때마다 순수 산술 연산 (0.0002ms)
const contentWidth = Math.max(100, effectiveWidth - OVERHEAD_H)
const result = layout(prepared, contentWidth, LINE_HEIGHT)
const totalBoxHeight = result.height + OVERHEAD_V
```

**데모 동작 및 비교 검증:**
- 컨테이너 너비 슬라이더 조절 (180px ~ 650px 동적 변경).
- 좌측 Pretext 방식(Reflow 0회, µs 단위 연산) vs 우측 기존 DOM 방식(`offsetHeight` 역측정, ms 단위 비용) 실시간 병렬 비교.
- 핵심 결과: 리사이즈 연산이 단순 숫자 가산으로만 구성되어 프레임 드랍(Jank)이 발생하지 않음.

---

## 3-2. 데모 2 : Accordion — DOM 측정 없는 무결점 아코디언 (Zero Reflow Height Transition)

- **문제 정의: 아코디언 높이 애니메이션의 구조적 한계**
  - 아코디언 UI 동작 요건: 닫힘 상태(`height: 0`) ➔ 열림 상태 전환 시 CSS 높이 트랜지션(`transition: height 200ms ease`) 적용 필요.
  - CSS 표준 명세상 한계: `height: auto` 대상으로는 시작점(`0px`)과 종료점(`auto`) 간 중간 수치 보간이 불가능하여 CSS transition 미동작.

**기존 방식의 문제점:**
1. **❌ CSS `max-height: 1000px` 트릭:**
   - 임의의 큰 값(`max-height: 1000px`)을 타겟으로 트랜지션 수행.
   - 실제 콘텐츠 높이가 80px인 경우에도 브라우저는 1000px 기준으로 200ms를 균등 분할.
   - 문제: 오픈 시 급격한 가속 발생, 클로즈 시 1000px ➔ 80px 구간 동안 시각적 변화가 없는 딜레이 현상 발생.
2. **❌ JS `element.scrollHeight` 동기 측정 (Naive 방식):**
   - 클릭 이벤트 발생 시 `element.scrollHeight` 또는 `offsetHeight`를 조회하여 인라인 `height`에 주입.
   - 문제: 상태 변경 직후 수치 조회로 인해 **강제 동기 레이아웃(Forced Synchronous Layout)** 유발. 메인 스레드 블로킹 및 클릭 시점 프레임 드랍(Jank) 발생.

**Pretext 솔루션 (`pages/demos/accordion.ts` 기반):**

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

**핵심 특징:**
1. **0 DOM Reflow:** DOM `scrollHeight` 질의 완전 배제. `layout()`의 순수 산술 연산으로 줄 수 산출 및 `lineHeight`·패딩 가산으로 정확한 픽셀 높이 산출. 강제 동기 레이아웃 0회 달성.
2. **정밀 애니메이션 타이밍:** 정확한 타겟 높이(예: 94px)를 직접 전달하여 클로즈 지연 및 오픈 급발진 없이 일관된 감속 곡선 유지.
3. **반응형 리사이즈 대응:** 뷰포트 및 컨테이너 너비 변경 시 텍스트 재분절 기반 목표 높이를 마이크로초(µs) 단위로 재계산하여 레이아웃 깨짐 방지.

**데모 검증 구성:**
- 컨테이너 너비 슬라이더 조절 지원.
- `Pretext 모드 (Zero Reflow)` vs `기존 Naive 모드 (scrollHeight 측정)` 토글 스위치 제공.
- 클릭 이벤트 발생 시 누적 강제 리플로우 횟수 및 연산 소요 시간(µs) 실시간 비교.
- 공식 문서 명칭: "Finally sane accordion (드디어 온전해진 아코디언)". CSS 한계 및 브라우저 렌더링 병목 동시 해소 사례.

---

## 3-3. 데모 3 : Streaming — LLM 토큰 스트리밍 & VSync 보호

- **문제 정의: 실시간 토큰 스트리밍 시 자동 스크롤 병목**
  - LLM 챗봇 인터페이스의 전형적인 안티패턴:

```javascript
// ❌ 안티패턴: 토큰 추가 후 scrollHeight 즉시 읽기
container.textContent += newToken             // Write ➔ Dirty 플래그 세팅
container.scrollTop = container.scrollHeight // Read ➔ 강제 동기 레이아웃 발생
```

  - 초당 30~50개 토큰 수신 시 동일 횟수의 `scrollHeight` 질의 발생.
  - 매 토큰마다 브라우저가 전체 텍스트 줄바꿈을 동기 재계산하여 메인 스레드 100% 점유 및 UI 인터랙션 중단 유발.

**Pretext 솔루션:**

```tsx
// ✅ Pretext 패턴: DOM에 묻지 않고 높이를 산술 연산으로 도출
const prepared = prepare(currentText, FONT)
const { height } = layout(prepared, effectiveWidth, LINE_HEIGHT)
chatBoxRef.current.scrollTop = height  // scrollHeight 대신 계산된 높이 사용
```

- `scrollHeight` 질의를 배제하고 Pretext 산술 연산 높이값으로 `scrollTop` 직접 갱신.
- DOM 기하 수치 질의 부재로 Dirty 플래그 강제 플러시 차단.
- VSync 프레임 예산(60Hz 기준 16.6ms / 120Hz 기준 8.3ms) 안정적 유지.

**데모 검증 구성:**
- `Pretext 모드 (Zero Reflow)` vs `기존 Naive 모드 (Forced Reflow)` 실시간 토글 비교.
- 토큰 스트리밍 중 누적 강제 리플로우 횟수 및 프레임 드랍 계측.
- Naive 모드 동작 시 리플로우 발생 시점 컨테이너 시각적 경고(적색 점멸) 표출.

---

## 3-4. 데모 4 : TanStack Virtual 무한스크롤 — 사전 계산 높이 100% 정밀 주입

- **개요:** `@tanstack/react-virtual` 가상화 라이브러리와 Pretext를 결합한 대규모 무한스크롤 피드 최적화.

**기존 TanStack Virtual의 가변 높이 처리 방식 및 한계:**

```tsx
// ❌ 기존 방식: estimateSize로 대충 추정 후 measureElement로 DOM 역측정
const virtualizer = useVirtualizer({
  count: items.length,
  getScrollElement: () => scrollRef.current,
  estimateSize: () => 140, // 대략적인 추정값 (부정확)
  measureElement: (el) => el.getBoundingClientRect().height, // ➔ 리플로우 유발
})
```

- `estimateSize`에 임의의 추정치(예: 140px) 전달 후, 실제 DOM 마운트 시점에 `measureElement`로 `getBoundingClientRect().height` 역측정하여 보정.
- 문제: 스크롤에 따른 신규 노드 마운트마다 `getBoundingClientRect()` 호출로 동기 레이아웃 재계산 발생. 추정값 오차로 인한 스크롤바 지터(Jitter/덜컹거림) 유발.

**Pretext 솔루션: 사전 정밀 높이 계산 및 주입:**

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
  estimateSize: (index) => heights[index], // 100% 정밀 확정값 주입
  // measureElement 미사용 ➔ DOM 역측정 0회
  overscan: 5,
})
```

**핵심 특징:**
1. **`estimateSize`에 정밀 확정값 주입:** Pretext로 1px 오차 없이 사전 계산된 높이를 전달하여 추정 보정 불필요.
2. **`measureElement` 완전 제거:** DOM 역측정 루틴 배제로 스크롤 중 강제 리플로우 0회 보장.
3. **GPU 합성 레이어 직행 (`transform: translate3d`):** `top: Ypx` 대신 `transform`을 적용하여 메인 스레드 Layout/Paint 단계를 배제하고 컴포지터 스레드 및 GPU에서 화면 직접 합성.

```tsx
// GPU 합성 직행 렌더링
<div style={{
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: `${virtualRow.size}px`,
  transform: `translate3d(0, ${virtualRow.start}px, 0)`, // 🚀 GPU 레이어 직행
}} />
```

**데모 계측 메트릭 및 검증 기능:**
- 총 피드 카드 수 (무한 스크롤 기준 최대 500개 동적 로딩).
- 실제 마운트된 DOM 노드 수 (예: 500개 중 6개 노드만 유지하여 98% DOM 절감).
- Pretext 텍스트 높이 연산 소요 시간 (전체 카드 대상 수십 µs).
- DOM 역측정 리플로우 횟수 (Pretext 모드: 0회 vs 비적용 모드: N회).
- **연쇄 리플로우 스트레스 테스트:** 15회 연속 DOM Write 및 `offsetHeight` Read 강제 교차 실행을 통한 메인 스레드 블로킹 시간 및 프레임 드랍 시각적 확인.

---

## 3-5. 데모 5 : ShapeFlow — 자유 형태 장애물 텍스트 래핑 (60fps 커서 라우팅)

- **문제 정의: 비정형 장애물 우회 텍스트 래핑의 CSS 한계**
  - CSS `float` 및 `shape-outside` 속성: 장애물의 단일 방향(한쪽 면)으로만 텍스트 흐름 제어 가능.
  - 장애물 양측으로 텍스트를 동시 분할 배치하는 레이아웃은 CSS 스펙상 구현 불가.

**Pretext 솔루션: 커서 기반 라인 라우팅 (Cursor-based Line Routing):**

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
    
    // ⚡ 핵심: 좌측 슬롯 끝 커서가 우측 슬롯 시작 커서로 즉시 이어짐
    cursor = line.end
  }
  lineTop += LINE_HEIGHT
}
```

**핵심 알고리즘 구조:**
1. **`layoutNextLine()` API:** `prepareWithSegments()`로 사전 전처리된 텍스트를 한 줄씩 순차 산출하는 이터레이터 방식 API. 라인별 가변 너비 지정 가능. 이전 라인 종료 커서(`line.end`)가 다음 라인 시작 커서로 연결됨.
2. **슬롯 분할 (Slot Carving):** 단일 라인 가용 공간에서 장애물 수평 점유 구간을 감산하여 좌/우 슬롯 생성. 각 슬롯에 순차적으로 `layoutNextLine()` 호출 및 커서 인계.

**데모 인터랙션 및 성능 검증:**
- 원형 장애물 드래그 앤 드롭 인터랙션 지원.
- 실시간 드래그 환경에서도 60fps 유지.
- CSS `shape-outside` 대비 차별점: 인라인 포맷팅 컨텍스트(IFC) 전체 무효화 방지로 프레임 드랍(15fps 이하 저하) 없이 부드러운 텍스트 재배치 수행.

---

## 4. 정리

1. **Pretext의 설계 목적:**
   - DOM에 텍스트 기하 수치를 질의하던 기존 방식 탈피.
   - 브라우저 인라인 텍스트 포맷팅 규칙을 자바스크립트 산술 연산으로 모델링하여 직접 연산하는 패러다임 제시.

2. **렌더링 파이프라인과 리플로우:**
   - 최신 엔진(RenderingNG, LayoutNG, LFC) 도입으로 렌더링 파이프라인은 고도화되었으나, 동기 수치 질의(`offsetHeight` 등)로 인한 강제 동기 레이아웃(Forced Synchronous Layout)은 구조적으로 회피 불가.
   - 해결책: DOM에 기하학적 수치를 질의하지 않는 설계 필수.

3. **Pretext 핵심 동작 원리:**
   - **Cold Path (`prepare`)**: `OffscreenCanvas` 기반 폰트 너비 1회 사전 측정 및 캐싱.
   - **Hot Path (`layout`)**: DOM/Canvas 접근 배제, 순수 산술 연산(배열 순회 및 `줄 수 × lineHeight`)으로 0.0002ms(0.2µs) 내 높이 산출.

4. **실무 가상화 적용 핵심 원칙:**
   - `estimateSize`에 사전 계산된 100% 정밀 높이 주입.
   - `measureElement` 완전 제거로 스크롤 중 강제 리플로우 0회 보장.
   - `transform: translate3d()` 적용을 통한 메인 스레드 레이아웃/페인트 우회 및 GPU 합성 레이어 직행.


## 5. Q&A

- 질의응답 진행
