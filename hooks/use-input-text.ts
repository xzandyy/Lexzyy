import { useCallback } from "react";
import { useState } from "react";

export default function useInputText(
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void,
  onEnter: () => void,
) {
  const [input, setInput] = useState("");

  const clearInput = useCallback(
    (e?: React.MouseEvent<HTMLTextAreaElement> | React.KeyboardEvent<HTMLTextAreaElement>) => {
      setInput("");
      if (e) {
        (e.target as HTMLTextAreaElement).style.height = "40px";
      }
    },
    [],
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInput(e.target.value);
      e.target.style.height = "auto";
      e.target.style.height = Math.min(e.target.scrollHeight, 184) + "px";
      onChange(e);
    },
    [onChange],
  );

  const handleEnter = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        clearInput(e);
        onEnter();
      }
    },
    [onEnter, clearInput],
  );

  return {
    input,
    clearInput,
    handleInputChange,
    handleEnter,
  };
}
