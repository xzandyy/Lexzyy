import React from "react";
import { Highlight, themes } from "prism-react-renderer";

const customStyle = {
  margin: 0,
  padding: "16px",
  fontSize: "14px",
  lineHeight: "1.5",
  backgroundColor: "#2d3748",
  whiteSpace: "pre" as const,
  wordWrap: "normal" as const,
  overflowWrap: "normal" as const,
  borderRadius: "0.5rem",
};

function CodeHighlight({ codeString, language }: { codeString: string; language: string }) {
  return (
    <div className="my-4 rounded-lg overflow-x-auto">
      <Highlight theme={themes.vsDark} code={codeString} language={language}>
        {({ style, tokens, getLineProps, getTokenProps }: any) => (
          <pre style={{ ...style, ...customStyle }}>
            {tokens.map((line: any, i: number) => (
              <div key={i} {...getLineProps({ line })}>
                {line.map((token: any, tokenIndex: number) => {
                  return <span key={tokenIndex} {...getTokenProps({ token })} />;
                })}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  );
}

export default CodeHighlight;
