import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { Label } from "./ui/Label";
import { createElement } from "react";

const createMarkdownElement = (tag: keyof JSX.IntrinsicElements, props: any) =>
  createElement(tag, {
    ...props,
  });

// Styling for HTML attributes for markdown component
const REACT_MARKDOWN_CONFIG: Components = {
  a: ({ node, ...props }) =>
    createMarkdownElement("a", {
      className: "text-orange",
      target: "_blank",
      ...props,
    }),
  strong: ({ node, ...props }) =>
    createMarkdownElement("span", {
      className: "underline",
      ...props,
    }),
  span: ({ ...props }: any) => <Label.Paragraph {...props} />,
  p: ({ ...props }: any) => <Label.Paragraph {...props} />,
};

interface MarkdownProps {
  children: string;
}
export const AppMarkdown = ({ children }: MarkdownProps) => {
  return (
    <ReactMarkdown
      skipHtml={false}
      components={REACT_MARKDOWN_CONFIG}
      remarkPlugins={[remarkGfm]}
    >
      {children}
    </ReactMarkdown>
  );
};
