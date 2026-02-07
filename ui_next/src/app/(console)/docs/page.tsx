"use client";

const DOC_LINKS = [
  {
    title: "Getting Started",
    description: "Learn how to set up and configure OpenClaw",
    url: "https://docs.openclaw.ai",
  },
  {
    title: "Configuration",
    description: "Understand all configuration options and settings",
    url: "https://docs.openclaw.ai/configuration",
  },
  {
    title: "Channels",
    description: "Connect and manage messaging channels",
    url: "https://docs.openclaw.ai/channels",
  },
  {
    title: "Skills",
    description: "Extend functionality with custom skills",
    url: "https://docs.openclaw.ai/skills",
  },
  {
    title: "API Reference",
    description: "Complete API documentation for developers",
    url: "https://docs.openclaw.ai/api",
  },
  {
    title: "Troubleshooting",
    description: "Common issues and solutions",
    url: "https://docs.openclaw.ai/troubleshooting",
  },
];

export default function DocsPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">Documentation</h1>
      <p className="text-muted-foreground mb-8">
        查看完整的使用文档和 API 参考
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {DOC_LINKS.map((link, index) => (
          <a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block border border-border rounded-lg p-4 bg-card hover:bg-muted/50 transition-colors"
          >
            <h2 className="text-lg font-semibold mb-1">{link.title}</h2>
            <p className="text-sm text-muted-foreground">{link.description}</p>
            <span className="text-xs text-accent mt-2 inline-block">
              Open docs.openclaw.ai →
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
