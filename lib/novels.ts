import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Novel, Chapter, Volume, NovelMetadata } from './types';

const STORIES_DIRECTORY = path.join(process.cwd(), 'public', 'stories');

// 获取所有小说列表
export function getAllNovels(): NovelMetadata[] {
  if (!fs.existsSync(STORIES_DIRECTORY)) {
    return [];
  }

  const novelDirs = fs.readdirSync(STORIES_DIRECTORY)
    .filter(dir => fs.statSync(path.join(STORIES_DIRECTORY, dir)).isDirectory());

  return novelDirs.map(dir => getNovelMetadata(dir)).filter(Boolean) as NovelMetadata[];
}

// 获取单个小说的元数据
export function getNovelMetadata(novelId: string): NovelMetadata | null {
  const novelPath = path.join(STORIES_DIRECTORY, novelId);
  const storyFile = path.join(novelPath, 'story.md');

  if (!fs.existsSync(storyFile)) {
    return null;
  }

  const fileContent = fs.readFileSync(storyFile, 'utf8');
  const { data, content } = matter(fileContent);

  // 获取章节信息
  const chaptersPath = path.join(novelPath, 'chapters');
  let chapterCount = 0;
  let volumeCount = 0;
  let lastChapter = null;

  if (fs.existsSync(chaptersPath)) {
    const volumes = fs.readdirSync(chaptersPath)
      .filter(vol => fs.statSync(path.join(chaptersPath, vol)).isDirectory());

    volumeCount = volumes.length;

    for (const volume of volumes) {
      const volumePath = path.join(chaptersPath, volume);
      const chapters = fs.readdirSync(volumePath)
        .filter(file => file.endsWith('.md'))
        .sort();

      chapterCount += chapters.length;

      if (chapters.length > 0) {
        const lastChapterFile = chapters[chapters.length - 1];
        const chapterNumber = parseInt(lastChapterFile.match(/chapter-(\d+)/)?.[1] || '0');
        const chapterContent = fs.readFileSync(path.join(volumePath, lastChapterFile), 'utf8');
        const chapterTitle = chapterContent.split('\n')[0].replace(/^#\s*/, '').replace(/第.*章\s*/, '');

        if (!lastChapter || chapterNumber > lastChapter.number) {
          lastChapter = {
            title: chapterTitle,
            number: chapterNumber
          };
        }
      }
    }
  }

  // 解析内容获取基本信息
  const lines = content.split('\n');
  let title = data.title || '未命名小说';
  let author = data.author || '佚名';
  let description = data.description || '';
  let genre = data.genre || '其他';
  let status = data.status || '连载中';
  let wordCount = data.wordCount || 0;

  // 从内容中提取信息（如果 frontmatter 中没有）
  for (const line of lines) {
    if (line.includes('小说：')) {
      title = line.replace(/.*小说：/, '').trim();
    }
    if (line.includes('作者：')) {
      author = line.replace(/.*作者：/, '').trim();
    }
    if (line.includes('类型：')) {
      genre = line.replace(/.*类型：/, '').trim();
    }
    if (line.includes('字数目标：')) {
      const match = line.match(/(\d+)/);
      if (match) {
        wordCount = parseInt(match[1]) * 10000; // 转换为字数
      }
    }
    if (line.includes('创作状态：')) {
      status = line.replace(/.*创作状态：/, '').trim();
    }
  }

  // 查找描述
  const descIndex = content.indexOf('一句话故事');
  if (descIndex !== -1) {
    const nextLines = content.substring(descIndex).split('\n');
    for (let i = 1; i < nextLines.length; i++) {
      if (nextLines[i].trim() && !nextLines[i].startsWith('#')) {
        description = nextLines[i].trim();
        break;
      }
    }
  }

  return {
    id: novelId,
    title,
    author,
    description,
    genre,
    status,
    wordCount,
    chapterCount,
    volumeCount,
    lastChapter: lastChapter || undefined
  };
}

// 获取小说详情（包含所有章节）
export function getNovelDetail(novelId: string): Novel | null {
  const metadata = getNovelMetadata(novelId);
  if (!metadata) return null;

  const novelPath = path.join(STORIES_DIRECTORY, novelId);
  const chaptersPath = path.join(novelPath, 'chapters');

  const volumes: Volume[] = [];
  const allChapters: Chapter[] = [];

  if (fs.existsSync(chaptersPath)) {
    const volumeDirs = fs.readdirSync(chaptersPath)
      .filter(vol => fs.statSync(path.join(chaptersPath, vol)).isDirectory())
      .sort();

    for (let volIndex = 0; volIndex < volumeDirs.length; volIndex++) {
      const volumeDir = volumeDirs[volIndex];
      const volumePath = path.join(chaptersPath, volumeDir);
      const volumeNumber = volIndex + 1;
      const volumeName = `第${volumeNumber}卷`;

      const volumeChapters: Chapter[] = [];

      const chapterFiles = fs.readdirSync(volumePath)
        .filter(file => file.endsWith('.md'))
        .sort();

      for (const chapterFile of chapterFiles) {
        const chapterNumber = parseInt(chapterFile.match(/chapter-(\d+)/)?.[1] || '0');
        const chapterPath = path.join(volumePath, chapterFile);
        const chapterContent = fs.readFileSync(chapterPath, 'utf8');

        // 提取章节标题
        const firstLine = chapterContent.split('\n')[0];
        const title = firstLine.replace(/^#\s*/, '').trim();

        const chapter: Chapter = {
          id: `${novelId}-${volumeDir}-${chapterNumber}`,
          volumeId: volumeDir,
          volumeName,
          number: chapterNumber,
          title,
          wordCount: chapterContent.length,
          createdAt: fs.statSync(chapterPath).birthtime.toISOString(),
          slug: `${volumeDir}/chapter-${String(chapterNumber).padStart(3, '0')}`
        };

        volumeChapters.push(chapter);
        allChapters.push(chapter);
      }

      volumes.push({
        id: volumeDir,
        name: volumeName,
        number: volumeNumber,
        chapters: volumeChapters
      });
    }
  }

  return {
    ...metadata,
    chapters: allChapters,
    volumes,
    createdAt: fs.statSync(novelPath).birthtime.toISOString(),
    updatedAt: fs.statSync(novelPath).mtime.toISOString()
  } as Novel;
}

// 获取章节内容
export function getChapterContent(novelId: string, volumeId: string, chapterNumber: number): Chapter | null {
  const chapterFile = `chapter-${String(chapterNumber).padStart(3, '0')}.md`;
  const chapterPath = path.join(STORIES_DIRECTORY, novelId, 'chapters', volumeId, chapterFile);

  if (!fs.existsSync(chapterPath)) {
    return null;
  }

  const content = fs.readFileSync(chapterPath, 'utf8');
  const firstLine = content.split('\n')[0];
  const title = firstLine.replace(/^#\s*/, '').trim();

  // 获取卷信息
  const volumeNumber = parseInt(volumeId.replace('volume-', ''));
  const volumeName = `第${volumeNumber}卷`;

  return {
    id: `${novelId}-${volumeId}-${chapterNumber}`,
    volumeId,
    volumeName,
    number: chapterNumber,
    title,
    content,
    wordCount: content.length,
    createdAt: fs.statSync(chapterPath).birthtime.toISOString(),
    slug: `${volumeId}/chapter-${String(chapterNumber).padStart(3, '0')}`
  };
}

// 获取上一章和下一章
export function getAdjacentChapters(novelId: string, currentVolumeId: string, currentChapterNumber: number) {
  const novel = getNovelDetail(novelId);
  if (!novel) return { prev: null, next: null };

  const allChapters = novel.chapters.sort((a, b) => {
    if (a.volumeId !== b.volumeId) {
      return a.volumeId.localeCompare(b.volumeId);
    }
    return a.number - b.number;
  });

  const currentIndex = allChapters.findIndex(
    ch => ch.volumeId === currentVolumeId && ch.number === currentChapterNumber
  );

  if (currentIndex === -1) return { prev: null, next: null };

  const prev = currentIndex > 0 ? allChapters[currentIndex - 1] : null;
  const next = currentIndex < allChapters.length - 1 ? allChapters[currentIndex + 1] : null;

  return { prev, next };
}