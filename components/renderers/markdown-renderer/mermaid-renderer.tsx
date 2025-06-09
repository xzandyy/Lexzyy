import React, { Suspense } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import mermaid from "mermaid";

mermaid.initialize({
  startOnLoad: false,
  theme: "default",
  securityLevel: "loose",
  fontFamily: "ui-sans-serif, system-ui, sans-serif",
  fontSize: 14,
  flowchart: {
    useMaxWidth: true,
    htmlLabels: true,
    curve: "basis",
  },
  sequence: {
    diagramMarginX: 50,
    diagramMarginY: 10,
    useMaxWidth: true,
  },
  gantt: {
    useMaxWidth: true,
  },
});

async function renderMermaidChart(chart: string, id: string): Promise<string> {
  const { svg } = await mermaid.render(`mermaid-${id}`, chart);
  return svg;
}

function MermaidContent({ chart, loading = false }: { chart: string; loading?: boolean }) {
  if (loading) {
    throw new Promise(() => {});
  }

  const id = crypto.randomUUID();

  const { data: svg } = useSuspenseQuery({
    queryKey: ["mermaid", id],
    queryFn: () => renderMermaidChart(chart, id),
    staleTime: 0,
    gcTime: 0,
  });

  return (
    <div className="my-4 overflow-x-auto">
      <div
        className="flex justify-center items-center min-h-[100px] bg-white rounded-lg border border-gray-200 p-4"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </div>
  );
}

function MermaidFallback() {
  return (
    <div className="my-4 overflow-x-auto">
      <div className="flex justify-center items-center min-h-[100px] bg-blue-50 border border-blue-200 rounded-lg">
        <div className="text-blue-600 text-sm flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          正在加载图表...
        </div>
      </div>
    </div>
  );
}

function MermaidRenderer({ chart, loading = false }: { chart: string; loading?: boolean }) {
  return (
    <Suspense fallback={<MermaidFallback />}>
      <MermaidContent chart={chart} loading={loading} />
    </Suspense>
  );
}

export default MermaidRenderer;
