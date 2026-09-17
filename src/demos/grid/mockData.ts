import { prepare } from '@chenglou/pretext';
import type { PreparedFeedCard } from './types';
import { FONT } from './constants';

export const SEED_PROMPTS = [
  {
    title: '네오 서울 사이버펑크 야시장',
    prompt:
      'cyberpunk neon street market in Neo-Seoul 2099, holographic signs reflecting on rain-slicked asphalt pavement, dense atmosphere, cinematic volumetric mist, intricate steam pipes, street food stalls, shot on 35mm anamorphic lens --ar 16:9 --v 6.1 --s 750',
    aspectRatio: 16 / 9,
    gradient: 'linear-gradient(135deg, #1f1c2c, #928dab)',
    author: 'Min-ji Kim',
    handle: '@neo_minji',
    avatarColor: '#58a6ff',
    category: 'Cyberpunk',
  },
  {
    title: '현대 교토의 대나무 정원 파빌리온',
    prompt:
      'minimalist architectural pavilion in modern Kyoto, bamboo reflection on calm water, clean geometric shadows, muted palette --ar 1:1 --v 6.0',
    aspectRatio: 1,
    gradient: 'linear-gradient(135deg, #2c3e50, #3498db)',
    author: 'Kenji Sato',
    handle: '@kenji_arch',
    avatarColor: '#3fb950',
    category: 'Architecture',
  },
  {
    title: '고대 유적지 속 잠든 기계신',
    prompt:
      'hyperrealistic cinematic portrait of an ancient robotic deity carved out of obsidian marble and glowing cyan circuitry, resting inside an overgrown sunken cathedral with glowing bioluminescent moss and cascading water, god rays breaking through shattered stained glass dome, unreal engine 5.4 render, octane lighting, photorealistic textures, 8k resolution, award winning photography, masterwork --ar 16:9 --v 6.1 --s 800 --style raw --q 2',
    aspectRatio: 16 / 9,
    gradient: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)',
    author: 'Elena Rostova',
    handle: '@elena_art',
    avatarColor: '#bc8cff',
    category: 'Sci-Fi',
  },
  {
    title: '아침 햇살과 따뜻한 녹차',
    prompt:
      'a serene ceramic teacup emitting gentle steam, morning sunlight on wooden tatami --ar 4:3 --v 6.0',
    aspectRatio: 4 / 3,
    gradient: 'linear-gradient(135deg, #596164, #868f96)',
    author: 'Ji-hoon Park',
    handle: '@quiet_mornings',
    avatarColor: '#f0883e',
    category: 'Minimal',
  },
  {
    title: '양자 슈퍼컴퓨터 단면 설계도',
    prompt:
      'isometric cutaway diagram of a futuristic subterranean data center and quantum fusion reactor, detailed technical blueprints, intricate wiring conduits, translucent server racks with glowing fiber optics, ambient occlusion, blueprint aesthetic, schematic illustration --chaos 20 --stylize 250 --ar 16:9',
    aspectRatio: 16 / 9,
    gradient: 'linear-gradient(135deg, #134e5e, #71b280)',
    author: 'Marcus Vance',
    handle: '@vance_quant',
    avatarColor: '#388bfd',
    category: 'Diagram',
  },
  {
    title: '안개 속의 버려진 우주 정거장',
    prompt:
      'abandoned retro-futuristic deep space orbital habitat drifting through violet nebular clouds, retro computers with CRT displays, floating zero-gravity debris, solitary melancholic mood, dramatic chiaroscuro lighting, grainy vintage film stock --ar 2:3 --v 6.1',
    aspectRatio: 2 / 3,
    gradient: 'linear-gradient(135deg, #3a1c71, #d76d77, #ffaf7b)',
    author: 'Astrid Lind',
    handle: '@astrid_space',
    avatarColor: '#f85149',
    category: 'Retro',
  },
  {
    title: '신비로운 발광 해파리 군집',
    prompt:
      'deep ocean abyss with ethereal translucent bioluminescent siphonophores and glowing jellies, macro details of pulsating cilia, crystalline turquoise refraction, national geographic deep sea expedition --ar 1:1 --v 6.0',
    aspectRatio: 1,
    gradient: 'linear-gradient(135deg, #000428, #004e92)',
    author: 'David Chen',
    handle: '@chen_deep',
    avatarColor: '#58a6ff',
    category: 'Nature',
  },
];

export function generateItems(startIndex: number, count: number): PreparedFeedCard[] {
  return Array.from({ length: count }, (_, i) => {
    const id = startIndex + i + 1;
    const seed = SEED_PROMPTS[(id - 1) % SEED_PROMPTS.length]!;
    const likes = Math.floor(20 + ((id * 37) % 850));

    return {
      id,
      title: `${seed.title} #${id}`,
      prompt: seed.prompt,
      aspectRatio: seed.aspectRatio,
      gradient: seed.gradient,
      author: seed.author,
      handle: seed.handle,
      avatarColor: seed.avatarColor,
      category: seed.category,
      version: 'v6.1',
      likes,
      preparedPrompt: prepare(seed.prompt, FONT, {
        whiteSpace: 'pre-wrap',
        wordBreak: 'keep-all',
      }),
    };
  });
}
