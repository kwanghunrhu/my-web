export type Category = 'commercial' | 'residential' | 'hotel';

export interface Project {
  id: string;
  title: string;
  category: Category;
  description: string;
  imageUrl: string;
  date: string;
}

export interface ThemeConfig {
  primaryColor: string;
  fontFamily: 'sans' | 'serif' | 'mono';
  siteTitle: string;
  logoUrl?: string;
}
