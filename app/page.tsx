import { getAllNovels } from "@/lib/novels";
import { NovelCard } from "@/components/novel/NovelCard";

export default function Home() {
  const novels = getAllNovels();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            在线小说阅读
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            精选优质小说，享受阅读时光
          </p>
        </header>

        <main>
          {novels.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 dark:text-gray-400">
                暂无小说，请添加小说文件到 public/stories 目录
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {novels.map((novel) => (
                <NovelCard key={novel.id} novel={novel} />
              ))}
            </div>
          )}
        </main>

        <footer className="mt-20 py-8 text-center text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-800">
          <p>&copy; 2025 在线小说阅读平台. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}