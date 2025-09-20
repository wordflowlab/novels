import { getChapterContent, getAdjacentChapters, getNovelDetail, getAllNovels } from "@/lib/novels";
import { ChapterReader } from "@/components/novel/ChapterReader";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function generateStaticParams() {
  const novels = getAllNovels();
  const params: { novelId: string; volumeId: string; chapterNumber: string }[] = [];

  for (const novel of novels) {
    const detail = getNovelDetail(novel.id);
    if (detail) {
      for (const chapter of detail.chapters) {
        params.push({
          novelId: novel.id,
          volumeId: chapter.volumeId,
          chapterNumber: chapter.number.toString(),
        });
      }
    }
  }

  return params;
}

interface PageProps {
  params: {
    novelId: string;
    volumeId: string;
    chapterNumber: string;
  };
}

export default function ChapterPage({ params }: PageProps) {
  const chapterNumber = parseInt(params.chapterNumber);
  const chapter = getChapterContent(params.novelId, params.volumeId, chapterNumber);
  const { prev, next } = getAdjacentChapters(params.novelId, params.volumeId, chapterNumber);

  if (!chapter) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">章节不存在</h1>
          <Link href={`/novels/${params.novelId}`}>
            <Button>返回目录</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <ChapterReader
      chapter={chapter}
      novelId={params.novelId}
      prevChapter={prev}
      nextChapter={next}
    />
  );
}