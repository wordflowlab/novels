import { getNovelDetail, getAllNovels } from "@/lib/novels";
import { ChapterList } from "@/components/novel/ChapterList";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function generateStaticParams() {
  const novels = getAllNovels();
  return novels.map((novel) => ({
    novelId: novel.id,
  }));
}

export default function NovelDetailPage({ params }: { params: { novelId: string } }) {
  const novel = getNovelDetail(params.novelId);

  if (!novel) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">小说不存在</h1>
          <Link href="/">
            <Button>返回首页</Button>
          </Link>
        </div>
      </div>
    );
  }

  const firstChapter = novel.chapters[0];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* 返回按钮 */}
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost">← 返回小说列表</Button>
          </Link>
        </div>

        {/* 小说信息 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">
            {novel.title}
          </h1>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-sm">
            <div>
              <span className="text-gray-500 dark:text-gray-400">作者：</span>
              <span className="font-medium">{novel.author}</span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">类型：</span>
              <span className="font-medium">{novel.genre}</span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">状态：</span>
              <span className="font-medium">{novel.status}</span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">字数：</span>
              <span className="font-medium">{(novel.wordCount / 10000).toFixed(1)}万</span>
            </div>
          </div>

          <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
            {novel.description}
          </p>

          {firstChapter && (
            <Link
              href={`/novels/${novel.id}/chapters/${firstChapter.volumeId}/${firstChapter.number}`}
            >
              <Button size="lg" className="w-full md:w-auto">
                开始阅读
              </Button>
            </Link>
          )}
        </div>

        {/* 章节列表 */}
        <ChapterList novel={novel} />
      </div>
    </div>
  );
}