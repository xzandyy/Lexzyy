interface TextInputProps {
  input: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onEnter: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
}

export default function TextInput({ input, onChange, onEnter, placeholder = "" }: TextInputProps) {
  return (
    <div className="px-4 py-1">
      <textarea
        placeholder={placeholder}
        className="w-full pt-3 pb-1 min-h-[40px] focus:outline-none resize-none text-gray-800"
        rows={1}
        value={input}
        onChange={onChange}
        onKeyDown={onEnter}
      />
    </div>
  );
}
