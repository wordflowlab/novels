import { remark } from 'remark';
import html from 'remark-html';

export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark().use(html).process(markdown);
  return result.toString();
}

// 处理章节内容的特殊格式
export function processChapterContent(content: string): string {
  // 移除第一行的标题（通常是 # 第X章 标题）
  const lines = content.split('\n');
  const processedLines = lines.slice(1); // 跳过第一行标题

  // 处理段落，添加适当的缩进
  return processedLines
    .map(line => {
      // 保持空行
      if (line.trim() === '') return '';

      // 如果是对话或特殊格式，保持原样
      if (line.trim().startsWith('"') || line.trim().startsWith('"')) {
        return line.trim();
      }

      // 普通段落添加首行缩进
      return `　　${line.trim()}`;
    })
    .join('\n');
}