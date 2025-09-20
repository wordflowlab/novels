"use client";

import Link from "next/link";
import { NovelMetadata } from "@/lib/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface NovelCardProps {
  novel: NovelMetadata;
}

export function NovelCard({ novel }: NovelCardProps) {
  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="text-xl font-bold line-clamp-1">
          {novel.title}
        </CardTitle>
        <CardDescription className="text-sm">
          作者：{novel.author}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-grow">
        <p className="text-gray-600 dark:text-gray-300 line-clamp-3 mb-4">
          {novel.description}
        </p>

        <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex justify-between">
            <span>类型</span>
            <span className="font-medium">{novel.genre}</span>
          </div>
          <div className="flex justify-between">
            <span>状态</span>
            <span className="font-medium">{novel.status}</span>
          </div>
          <div className="flex justify-between">
            <span>字数</span>
            <span className="font-medium">{(novel.wordCount / 10000).toFixed(1)}万字</span>
          </div>
          <div className="flex justify-between">
            <span>章节</span>
            <span className="font-medium">{novel.chapterCount}章</span>
          </div>
          {novel.lastChapter && (
            <div className="pt-2 border-t">
              <p className="text-xs">最新章节：</p>
              <p className="text-sm font-medium truncate">
                第{novel.lastChapter.number}章 {novel.lastChapter.title}
              </p>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-4">
        <Link href={`/novels/${novel.id}`} className="w-full">
          <Button className="w-full">开始阅读</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}