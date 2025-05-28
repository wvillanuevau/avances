export function Progress({ value }) {
  return (
    <div className="w-full bg-gray-200 rounded-full h-4">
      <div
        className="bg-green-500 h-4 rounded-full transition-all duration-300"
        style={{ width: `${value}%` }}
      ></div>
    </div>
  );
}
