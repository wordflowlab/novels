// 小说相关类型定义

export interface Novel {
  id: string;
  title: string;
  author: string;
  description: string;
  genre: string;
  status: string;
  wordCount: number;
  coverImage?: string;
  createdAt: string;
  updatedAt: string;
  chapters: Chapter[];
  volumes: Volume[];
}

export interface Volume {
  id: string;
  name: string;
  number: number;
  chapters: Chapter[];
  description?: string;
}

export interface Chapter {
  id: string;
  volumeId: string;
  volumeName: string;
  number: number;
  title: string;
  content?: string;
  wordCount: number;
  createdAt: string;
  slug: string;
}

export interface NovelMetadata {
  id: string;
  title: string;
  author: string;
  description: string;
  genre: string;
  status: string;
  wordCount: number;
  chapterCount: number;
  volumeCount: number;
  lastChapter?: {
    title: string;
    number: number;
  };
}

export interface ReadingProgress {
  novelId: string;
  chapterId: string;
  position: number;
  updatedAt: string;
}

export interface ReaderSettings {
  fontSize: number;
  lineHeight: number;
  theme: 'light' | 'dark' | 'sepia';
  fontFamily: string;
}