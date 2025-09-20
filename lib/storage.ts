import { ReadingProgress, ReaderSettings } from './types';

const PROGRESS_KEY = 'novel_reading_progress';
const SETTINGS_KEY = 'novel_reader_settings';

// 获取阅读进度
export function getReadingProgress(novelId: string): ReadingProgress | null {
  if (typeof window === 'undefined') return null;

  try {
    const allProgress = localStorage.getItem(PROGRESS_KEY);
    if (!allProgress) return null;

    const progressMap = JSON.parse(allProgress);
    return progressMap[novelId] || null;
  } catch (error) {
    console.error('Failed to get reading progress:', error);
    return null;
  }
}

// 保存阅读进度
export function saveReadingProgress(progress: ReadingProgress): void {
  if (typeof window === 'undefined') return;

  try {
    const allProgress = localStorage.getItem(PROGRESS_KEY);
    const progressMap = allProgress ? JSON.parse(allProgress) : {};

    progressMap[progress.novelId] = {
      ...progress,
      updatedAt: new Date().toISOString()
    };

    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progressMap));
  } catch (error) {
    console.error('Failed to save reading progress:', error);
  }
}

// 获取阅读器设置
export function getReaderSettings(): ReaderSettings {
  if (typeof window === 'undefined') {
    return getDefaultSettings();
  }

  try {
    const settings = localStorage.getItem(SETTINGS_KEY);
    if (!settings) return getDefaultSettings();

    return JSON.parse(settings);
  } catch (error) {
    console.error('Failed to get reader settings:', error);
    return getDefaultSettings();
  }
}

// 保存阅读器设置
export function saveReaderSettings(settings: ReaderSettings): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save reader settings:', error);
  }
}

// 默认设置
function getDefaultSettings(): ReaderSettings {
  return {
    fontSize: 18,
    lineHeight: 1.8,
    theme: 'light',
    fontFamily: 'serif'
  };
}