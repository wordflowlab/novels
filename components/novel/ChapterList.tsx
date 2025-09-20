"use client";

import Link from "next/link";
import { Novel } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface ChapterListProps {
  novel: Novel;
}

export function ChapterList({ novel }: ChapterListProps) {
  const [expandedVolumes, setExpandedVolumes] = useState<Set<string>>(
    new Set([novel.volumes[0]?.id])
  );

  const toggleVolume = (volumeId: string) => {
    setExpandedVolumes((prev) => {
      const next = new Set(prev);
      if (next.has(volumeId)) {
        next.delete(volumeId);
      } else {
        next.add(volumeId);
      }
      return next;
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          章节目录
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          共 {novel.volumes.length} 卷 {novel.chapters.length} 章
        </p>
      </div>

      <ScrollArea className="h-[600px]">
        <div className="p-6">
          {novel.volumes.map((volume) => (
            <div key={volume.id} className="mb-6">
              <Button
                variant="ghost"
                className="w-full justify-between mb-3 text-left"
                onClick={() => toggleVolume(volume.id)}
              >
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  {volume.name}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {volume.chapters.length} 章
                </span>
              </Button>

              {expandedVolumes.has(volume.id) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {volume.chapters.map((chapter) => (
                    <Link
                      key={chapter.id}
                      href={`/novels/${novel.id}/chapters/${chapter.volumeId}/${chapter.number}`}
                      className="block"
                    >
                      <div className="px-4 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <span className="text-sm text-gray-700 dark:text-gray-300 line-clamp-1">
                          第{chapter.number}章 {chapter.title.replace(/第.*章\s*/, "")}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}