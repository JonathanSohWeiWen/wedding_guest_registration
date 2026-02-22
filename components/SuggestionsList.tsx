type Guest = { name: string; arrived: boolean };

type SuggestionsListProps = {
  suggestions: Guest[];
  onSelect: (name: string) => void;
};

export default function SuggestionsList({
  suggestions,
  onSelect,
}: SuggestionsListProps) {
  if (suggestions.length <= 1) return null;

  return (
    <ul className="absolute left-0 right-0 mt-1 z-50 border rounded-md bg-white max-h-56 overflow-auto text-sage-900 shadow">
      {suggestions.map((s) => (
        <li
          key={s.name}
          className="flex justify-between items-center p-2 hover:bg-sage-50 cursor-pointer"
          onClick={() => onSelect(s.name)}
        >
          <span>{s.name}</span>
          {s.arrived && <span className="text-xs text-sage-600">Arrived</span>}
        </li>
      ))}
    </ul>
  );
}
