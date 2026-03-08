import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";

export const markdownComponents: Components = {
  pre: ({ children }) => <pre className="my-2 overflow-x-auto rounded-lg bg-[#1e1e1e] p-4">{children}</pre>,
  code: ({ className, children, ...props }) => {
    const isInline = !className;
    return isInline ? (
      <code className="rounded bg-[#2a2a2a] px-1.5 py-0.5 text-sm" {...props}>
        {children}
      </code>
    ) : (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },
  a: ({ href, children }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-[#10a37f] hover:underline">
      {children}
    </a>
  ),
  table: ({ children }) => (
    <div className="my-4 overflow-x-auto">
      <table className="min-w-full border-collapse border border-[#333]">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border border-[#333] bg-[#2a2a2a] px-4 py-2 text-left font-semibold">{children}</th>
  ),
  td: ({ children }) => <td className="border border-[#333] px-4 py-2">{children}</td>,
};

export function renderMarkdown(content: string) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
      {content}
    </ReactMarkdown>
  );
}
