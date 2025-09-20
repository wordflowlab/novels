"use client";

import { Chapter } from "@/lib/types";
import { processChapterContent } from "@/lib/markdown";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { saveReadingProgress, getReaderSettings, saveReaderSettings } from "@/lib/storage";

interface ChapterReaderProps {
  chapter: Chapter;
  novelId: string;
  prevChapter: Chapter | null;
  nextChapter: Chapter | null;
}

export function ChapterReader({ chapter, novelId, prevChapter, nextChapter }: ChapterReaderProps) {
  const [settings, setSettings] = useState(getReaderSettings());
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    // 保存阅读进度
    saveReadingProgress({
      novelId,
      chapterId: chapter.id,
      position: 0,
      updatedAt: new Date().toISOString(),
    });
  }, [chapter.id, novelId]);

  const updateSetting = (key: keyof typeof settings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    saveReaderSettings(newSettings);
  };

  const processedContent = chapter.content ? processChapterContent(chapter.content) : "";

  const getThemeClasses = () => {
    switch (settings.theme) {
      case "dark":
        return "bg-gray-900 text-gray-100";
      case "sepia":
        return "bg-amber-50 text-amber-900";
      default:
        return "bg-white text-gray-900";
    }
  };

  return (
    <div className={`min-h-screen ${getThemeClasses()} transition-colors`}>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* 顶部导航 */}
        <header className="mb-8 pb-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <Link href={`/novels/${novelId}`}>
              <Button variant="ghost" size="sm">← 返回目录</Button>
            </Link>

            <h1 className="text-xl font-bold text-center flex-1 px-4">
              {chapter.title}
            </h1>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
            >
              设置
            </Button>
          </div>
        </header>

        {/* 设置面板 */}
        {showSettings && (
          <div className="mb-8 p-4 rounded-lg bg-gray-100 dark:bg-gray-800">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">字体大小</label>
                <input
                  type="range"
                  min="14"
                  max="24"
                  value={settings.fontSize}
                  onChange={(e) => updateSetting("fontSize", parseInt(e.target.value))}
                  className="w-full"
                />
                <span className="text-xs">{settings.fontSize}px</span>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">行高</label>
                <input
                  type="range"
                  min="1.4"
                  max="2.4"
                  step="0.1"
                  value={settings.lineHeight}
                  onChange={(e) => updateSetting("lineHeight", parseFloat(e.target.value))}
                  className="w-full"
                />
                <span className="text-xs">{settings.lineHeight}</span>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">主题</label>
                <select
                  value={settings.theme}
                  onChange={(e) => updateSetting("theme", e.target.value)}
                  className="w-full px-2 py-1 rounded border"
                >
                  <option value="light">明亮</option>
                  <option value="dark">暗黑</option>
                  <option value="sepia">护眼</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* 章节内容 */}
        <article
          className="prose prose-lg max-w-none mb-12"
          style={{
            fontSize: `${settings.fontSize}px`,
            lineHeight: settings.lineHeight,
            fontFamily: settings.fontFamily === "serif" ? "serif" : "sans-serif",
          }}
        >
          <div className="whitespace-pre-wrap">{processedContent}</div>
        </article>

        {/* 底部导航 */}
        <footer className="py-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            {prevChapter ? (
              <Link
                href={`/novels/${novelId}/chapters/${prevChapter.volumeId}/${prevChapter.number}`}
              >
                <Button variant="outline">
                  ← 上一章
                </Button>
              </Link>
            ) : (
              <Button variant="outline" disabled>
                ← 上一章
              </Button>
            )}

            <Link href={`/novels/${novelId}`}>
              <Button variant="ghost">目录</Button>
            </Link>

            {nextChapter ? (
              <Link
                href={`/novels/${novelId}/chapters/${nextChapter.volumeId}/${nextChapter.number}`}
              >
                <Button variant="outline">
                  下一章 →
                </Button>
              </Link>
            ) : (
              <Button variant="outline" disabled>
                下一章 →
              </Button>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
}