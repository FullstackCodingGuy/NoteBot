import { type ClassValue, clsx } from 'clsx'
import DOMPurify from 'dompurify'
import { twMerge } from 'tailwind-merge'
import { marked } from "marked";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const SanitizedHTML = (htmlString: string) => {
  return DOMPurify.sanitize(htmlString) // ✅ Removes malicious scripts
}

export default function MarkdownRenderer(content: string) {
  return marked(content) // ✅ Renders markdown content
}
