export default function Home() {
  const handleSubmit = (e) => {
    e.preventDefault();
    const videoId = e.target.videoId.value;
    if (videoId) {
      window.location.href = `/player/${videoId}`;
    }
  };

  return (
    <main className="h-screen flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full flex flex-col gap-3 max-w-sm"
      >
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="videoId"
            className="text-lg font-semibold"
          >
            YouTube VideoId
          </label>
          <input
            type="text"
            name="videoId"
            placeholder="Enter YouTube Video id"
            className="outline-none p-3 text-sm rounded-md border focus:border-sky-500 transition-border duration-200"
          />
        </div>
        <button
          type="submit"
          className="bg-sky-500 text-white font-bold py-2 px-4 rounded hover:opacity-80 transition-opacity duration-200"
        >
          Submit
        </button>
      </form>
      <p className="text-sm text-zinc-800 fixed bottom-10 inset-x-0 text-center">
        Made by{" "}
        <a
          className="font-medium text-sky-500 hover:underline transition-all"
          href="https://git.new/sudip"
          target="_blank"
          rel="noreferrer noopener"
        >
          @sudipb7
        </a>
      </p>
    </main>
  );
}
