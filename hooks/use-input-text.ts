import { useCallback } from "react";
import { useState } from "react";

export default function useInputText(
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void,
  onEnter: () => void,
) {
  const [input, setInput] = useState("");

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange(e);
      setInput(e.target.value);
      e.target.style.height = "auto";
      e.target.style.height = Math.min(e.target.scrollHeight, 184) + "px";
    },
    [onChange],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        setInput("");
        onEnter();
        (e.target as HTMLTextAreaElement).style.height = "40px";
      }
    },
    [onEnter],
  );

  return {
    input,
    handleChange,
    handleKeyDown,
  };
}
