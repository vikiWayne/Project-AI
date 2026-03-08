import { memo } from "react";
import type { MessageContent } from "@/types/globalTypes";
import { renderMarkdown } from "@/lib/markdown";
import { cn } from "@/lib/utils";

interface MediaRendererProps {
  content: MessageContent;
  className?: string;
}

function MediaRendererInner({ content, className }: MediaRendererProps) {
  switch (content.type) {
    case "text":
      return (
        <div className={cn("prose prose-invert max-w-none dark:prose-invert", className)}>
          {renderMarkdown(content.text)}
        </div>
      );
    case "image":
      return (
        <img
          src={content.url}
          alt="Response image"
          className={cn("max-w-full rounded-lg", className)}
        />
      );
    case "video":
      return (
        <video
          src={content.url}
          controls
          className={cn("max-w-full rounded-lg", className)}
        />
      );
    case "audio":
      return (
        <audio src={content.url} controls className={cn("max-w-full", className)} />
      );
    default:
      return null;
  }
}

export const MediaRenderer = memo(MediaRendererInner);
