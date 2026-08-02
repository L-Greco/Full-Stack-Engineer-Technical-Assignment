export default function FormErrorMessage({ message }: { message: string | undefined }) {
  return message ? <p className="text-sm text-rose-600">{message}</p> : null;
}