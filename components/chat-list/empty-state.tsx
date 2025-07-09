import useLocale from "@/hooks/use-locale";

export default function EmptyState() {
  const { t } = useLocale();
  return (
    <div className="h-[50vh] flex items-center justify-center">
      <div className="text-center text-gray-500">
        <h3 className="text-2xl font-medium mb-2 text-gray-900">{t.list.startNewChat}</h3>
        <p className="text-gray-500">{t.list.chatDescription}</p>
      </div>
    </div>
  );
}
