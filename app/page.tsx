'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [videoInfo, setVideoInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [Thumbnail, setThumbnail] = useState(false);
  const [musicl, setmusicl] = useState(false);

const [downloadingQuality, setDownloadingQuality] = useState<string | null>(null);

  useEffect(() => {
  console.log("✅ API URL:", process.env.NEXT_PUBLIC_API_URL);
}, []);

  const handleFetchInfo = async () => {
    if (!url) return alert("Please enter a YouTube URL.");

    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/download`,  {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ url }),
});

      const data = await res.json();
      if (data.error) {
        alert(data.error);
      } else {
        setVideoInfo(data);
      }
    } catch (err: any) {
  console.error("❌ Fetch Info Error:", err?.message || err);
  alert(err?.message || "Something went wrong");

    } finally {
      setLoading(false);
    }
  };

  const handleVideoDownload = async (format: any) => {
  setDownloadingQuality(format.format_id); // ✅ Use format_id instead of format.quality

  try {
     setLoading(true);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/download-video`,  {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ url }),
});

    const blob = await res.blob();
    const fileName = `${videoInfo.title}-${format.quality}.mp4`;

    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(link.href);
  } catch (err) {
    console.error("❌ Download failed:", err);
    alert("Download failed!");
  } finally {
    setDownloadingQuality(null);
    setLoading(false);
  }
};


 const handleAudioDownload = async (format = 'mp3') => {
  try {
    setmusicl(true);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/download-audio`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url,
        audioFormat: format, // pass 'mp3' or 'wav'
      }),
    });

    const blob = await res.blob();
    const fileName = `${videoInfo.title}-audio.${format}`;

    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(link.href);

  } catch (err) {
    console.error("❌ Audio download failed:", err);
    alert("Audio download failed!");
  }
    finally {
      setmusicl(false);
    }
};




  const handleThumbnailDownload = async () => {
  try {
    setThumbnail(true);
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/download-thumbnail-file`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: videoInfo.thumbnail }),
    });

    const blob = await response.blob();
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = `${videoInfo.title}-thumbnail.jpg`;
    link.click();
    window.URL.revokeObjectURL(link.href);
  } catch (err) {
    console.error("❌ Thumbnail download failed:", err);
    alert("Failed to download thumbnail");
  }
    finally {
      setThumbnail(false);
    }
};



  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4 py-10">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-xl text-center">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-4">
          🎥 YouTube Video Downloader
        </h1>
        <p className="text-gray-600 mb-6">Paste a YouTube video URL below:</p>

        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onBlur={(e) => setUrl(e.target.value.trim())}
          placeholder="https://www.youtube.com/watch?v=..."
          className="w-full text-gray-500 border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleFetchInfo}
          className="mt-4 inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-xl font-semibold shadow-md hover:scale-105 transition-transform"
        >
          🚀 Fetch Video
        </button>

        {loading && (
          <div className="w-full mt-6 animate-pulse">
            <div className="w-full h-48 bg-gray-200 rounded-xl mb-4" />
            <div className="h-4 bg-gray-300 rounded w-2/3 mx-auto mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto mb-2"></div>
          </div>
        )}

        {videoInfo && (
          <div className="mt-8 text-left">
            <h2 className="text-xl font-bold text-gray-800 mb-2">🎬 {videoInfo.title}</h2>

            {videoInfo.thumbnail && (
              <div className="mb-4">
                <img
                  src={videoInfo.thumbnail}
                  alt="Video thumbnail"
                  className="w-full max-w-md rounded-xl shadow-md mb-2"
                />
                <button
  onClick={handleThumbnailDownload}
  className="inline-block mt-2 text-sm bg-emerald-600 text-white px-4 py-1.5 rounded-lg hover:bg-emerald-700 transition-colors"
>
      {Thumbnail ? '🖼️ Downloading Thumbnail...' : '📸 Download Thumbnail'}

</button>
              </div>
            )}

            {videoInfo.audio && (
              <div className="mb-6">
                <div className="flex flex-col gap-2">
  <button
    onClick={() => handleAudioDownload('mp3')}
    disabled={downloadingQuality === 'mp3'}
    className="bg-pink-600 text-white px-4 py-2 rounded-md"
  >
    {musicl ? '⏳ Downloading MP3...' : '🎧 Download MP3'}
  </button>

  <button
     onClick={() => handleAudioDownload("wav")}
    disabled={downloadingQuality === 'wav'}
    className="bg-amber-600 text-white px-4 py-2 rounded-md"
  >
    {musicl ? '⏳ Downloading Wav...' : '🎧 Download Wav'}
  </button>
</div>

                <p className="text-sm text-gray-500 mt-1">
                  Size: {videoInfo.audio.size}
                </p>
              </div>
            )}

            <h3 className="text-lg text-gray-600 mb-2">Available Video Formats:</h3>

            {videoInfo.formats?.length > 0 ? (
              <ul className="flex flex-col gap-3 mt-4">
                {videoInfo.formats.map((format: any, index: number) => (
                  <li key={index}>
                    <button 
  onClick={() => handleVideoDownload(format)}
  disabled={downloadingQuality === format.format_id}
  className={`inline-block px-4 py-2 rounded-lg shadow-md text-sm font-medium transition-colors ${
    downloadingQuality === format.format_id
      ? 'bg-gray-400 cursor-not-allowed'
      : 'bg-blue-600 hover:bg-blue-700 text-white'
  }`}
>
  {downloadingQuality === format.format_id
    ? '⏳ Downloading...'
    : `🔽 Download ${format.quality}`}
</button>
                    <span className="text-sm text-gray-500 ml-2">
                      {format.hasAudio ? '(video + Audio )' : '(video + Audio)'} • {format.size}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-red-500 mt-4">⚠ No downloadable formats found.</p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}