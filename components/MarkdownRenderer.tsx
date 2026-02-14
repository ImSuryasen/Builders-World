type MarkdownRendererProps = {
  html: string;
};

export default function MarkdownRenderer({ html }: MarkdownRendererProps): JSX.Element {
  return <article className="prose-content" dangerouslySetInnerHTML={{ __html: html }} />;
}
