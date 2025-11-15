import ReactMarkdown from "react-markdown";

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-ul:text-gray-700 prose-li:text-gray-700">
      <ReactMarkdown
        components={{
          h2: ({ children }) => (
            <h2 className="mt-8 mb-4 text-gray-900 border-b border-gray-200 pb-2">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mt-6 mb-3 text-gray-900">{children}</h3>
          ),
          p: ({ children }) => (
            <p className="mb-4 text-gray-700 leading-relaxed">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="mb-4 space-y-1 text-gray-700">{children}</ul>
          ),
          li: ({ children }) => (
            <li className="text-gray-700">{children}</li>
          ),
          strong: ({ children }) => (
            <strong className="text-gray-900">{children}</strong>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
