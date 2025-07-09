import { Suspense, memo } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import useLocale from "@/hooks/use-locale";
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

function fnv1a(str: string) {
  let hash = 0x811c9dc5;
  const prime = 0x01000193;

  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, prime);
  }

  return (hash >>> 0).toString(16).padStart(8, "0");
}

async function renderMermaidChart(chart: string, id: string): Promise<string> {
  const { svg } = await mermaid.render(`mermaid-${id}`, chart);
  return svg;
}

const MermaidContent = memo(function MermaidContent({ chart }: { chart: string }) {
  const id = fnv1a(chart);

  const { data: svg } = useSuspenseQuery({
    queryKey: ["mermaid", id],
    queryFn: () => renderMermaidChart(chart, id),
    staleTime: 5 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  return (
    <div className="my-4 overflow-x-auto">
      <div
        className="flex justify-center items-center min-h-[100px] bg-white rounded-lg border border-gray-200 p-4"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </div>
  );
});

function MermaidFallback() {
  const { t } = useLocale();
  return (
    <div className="my-4 overflow-x-auto">
      <div className="flex justify-center items-center min-h-48 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="text-blue-600 text-sm flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          {t.markdown.loadingChart}
        </div>
      </div>
    </div>
  );
}

const MermaidRenderer = memo(function MermaidRenderer({
  chart,
  loading = false,
}: {
  chart: string;
  loading?: boolean;
}) {
  if (loading) {
    return <MermaidFallback />;
  }

  return (
    <Suspense fallback={<MermaidFallback />}>
      <MermaidContent chart={chart} />
    </Suspense>
  );
});

export default MermaidRenderer;
