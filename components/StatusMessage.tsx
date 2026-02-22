type StatusMessageProps = {
  message: string | null;
};

export default function StatusMessage({ message }: StatusMessageProps) {
  if (!message) return null;
  return <p className="mt-2 text-sm text-sage-700">{message}</p>;
}
