export function Card({ children }) {
  return (
    <div className="bg-white shadow-md rounded-2xl p-4 border">{children}</div>
  );
}

export function CardContent({ children }) {
  return <div className="space-y-4">{children}</div>;
}
