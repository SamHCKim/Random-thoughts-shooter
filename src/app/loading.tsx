export default function LoadingPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 pt-6 pb-40">
      {[1, 2, 3].map((i) => (
        <div key={i} className="mb-4 flex flex-col items-start">
          <div className="mb-1 ml-1 h-3 w-16 rounded bg-gray-200 animate-pulse" />
          <div className="w-[70%] rounded-2xl rounded-tl-sm bg-gray-100 animate-pulse px-4 py-3">
            <div className="h-4 w-full rounded bg-gray-200" />
            <div className="mt-2 h-3 w-2/3 rounded bg-gray-200" />
          </div>
        </div>
      ))}
    </div>
  );
}
