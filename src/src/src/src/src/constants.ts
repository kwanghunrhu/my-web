import { Project, ThemeConfig } from './types';

export const DEFAULT_THEME: ThemeConfig = {
  primaryColor: '#1a1a1a',
  fontFamily: 'sans',
  siteTitle: '옳음 디자인&컨설팅',
};

export const INITIAL_PROJECTS: Project[] = [
  {
    id: '1',
    title: '럭셔리 호텔 리모델링',
    category: 'hotel',
    description: '글로벌 스탠다드를 뛰어넘는 최상의 휴식과 프리미엄 경험을 제공하는 호텔 인테리어 프로젝트입니다.',
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1600',
    date: '2023-12-01',
  },
  {
    id: '2',
    title: '미니멀 주거 공간',
    category: 'residential',
    description: '당신의 삶의 결을 담은 가장 편안하고 세련된 집을 완성했습니다. 미니멀리즘의 정수를 보여줍니다.',
    imageUrl: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1600',
    date: '2024-01-15',
  }
];
