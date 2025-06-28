import useInputText from "@/hooks/use-input-text";

interface TextInputProps {
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onEnter: () => void;
  placeholder?: string;
}

export default function TextInput({ onChange, onEnter, placeholder = "" }: TextInputProps) {
  const { input, handleChange, handleKeyDown } = useInputText(onChange, onEnter);
  return (
    <div className="px-4 py-1">
      <textarea
        placeholder={placeholder}
        className="w-full pt-3 pb-1 min-h-[40px] focus:outline-none resize-none text-gray-800"
        rows={1}
        value={input}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}
