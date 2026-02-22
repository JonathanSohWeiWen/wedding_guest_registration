type ActionButtonsProps = {
  buttonText: string;
  isDisabled: boolean;
  isLoading: boolean;
  onMark: () => void;
  onClear: () => void;
  children?: React.ReactNode;
};

export default function ActionButtons({
  buttonText,
  isDisabled,
  isLoading,
  onMark,
  onClear,
  children,
}: ActionButtonsProps) {
  const btnClass = `px-4 py-2 bg-sage-600 text-white rounded-md ${isDisabled ? "" : "hover:bg-sage-700"} disabled:opacity-50`;

  return (
    <div className="mt-2 flex flex-col md:flex-row md:items-center gap-3">
      <button className={btnClass} onClick={onMark} disabled={isDisabled}>
        {buttonText}
      </button>
      <button
        className="px-3 py-2 border rounded-md bg-gray-600"
        onClick={onClear}
      >
        CLEAR
      </button>
      {children}
    </div>
  );
}
