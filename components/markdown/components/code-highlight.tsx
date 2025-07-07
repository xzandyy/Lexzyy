import { createLowlight } from "lowlight";
import { memo, useEffect, useRef, useState } from "react";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { staticCodeImports } from "./static-code-imports";
import "highlight.js/styles/atom-one-dark.min.css";

const lowlight = createLowlight();

const customStyle = {
  margin: 0,
  color: "#fff",
  padding: "16px",
  fontSize: "14px",
  lineHeight: "1.5",
  backgroundColor: "#2d3748",
  whiteSpace: "pre" as const,
  wordWrap: "normal" as const,
  overflowWrap: "normal" as const,
  borderRadius: "0.5rem",
};

export default function Highlight({ language, code }: { language: string | undefined; code: string | undefined }) {
  const [notSupported, setNotSupported] = useState(language ? !lowlight.registered(language) : true);
  const lines = useLines(code);

  useEffect(() => {
    if (!language || lowlight.registered(language)) {
      return;
    }

    const loader = staticCodeImports[language];

    if (loader) {
      loader().then((languageFn) => {
        lowlight.register(language, languageFn.default);
        setNotSupported(false);
      });
    }
  }, [language]);

  if (!code || !language) return null;

  return (
    <div className="my-4 rounded-lg overflow-x-auto">
      <pre style={customStyle}>
        <code>
          {lines.map((line, index) => (
            <HighlightLine key={index} language={notSupported ? "text" : language} line={line} />
          ))}
        </code>
      </pre>
    </div>
  );
}

const HighlightLine = memo(function HighlightLine({ language, line }: { language: string; line: string }) {
  if (language === "text") {
    return line;
  }

  const tree = lowlight.highlight(language, line);

  return toJsxRuntime(tree, {
    Fragment,
    ignoreInvalidStyle: true,
    jsx,
    jsxs,
    passKeys: true,
  });
});

const useLines = (code: string | undefined) => {
  const record = useRef<{
    lines: string[];
    stableLength: number;
    lineCount: number;
  }>({
    lines: [],
    stableLength: 0,
    lineCount: 0,
  });

  if (!code) {
    return [];
  }

  const data = record.current;

  const newLines = code.slice(data.stableLength).split("\n");

  for (let i = 0; i < newLines.length; i++) {
    data.lines[data.lineCount + i] = newLines[i] + "\n";
  }

  data.stableLength = code.lastIndexOf("\n") + 1;
  data.lineCount += newLines.length - 1;

  return data.lines;
};
