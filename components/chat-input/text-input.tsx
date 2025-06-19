import { useCallback } from "react";

interface TextInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  placeholder?: string;
}

export default function TextInput({ value, onChange, onSubmit, placeholder = "发送消息给 Lexzyy..." }: TextInputProps) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange(e);
      e.target.style.height = "auto";
      e.target.style.height = Math.min(e.target.scrollHeight, 184) + "px";
    },
    [onChange],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        onSubmit(e);
        (e.target as HTMLTextAreaElement).style.height = "40px";
      }
    },
    [onSubmit],
  );

  return (
    <div className="px-4 py-1">
      <textarea
        placeholder={placeholder}
        className="w-full pt-3 pb-1 min-h-[40px] focus:outline-none resize-none text-gray-800"
        rows={1}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}
