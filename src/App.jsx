import { useState, useEffect } from "react";
import FileUpload from "./components/FileUpload";
import {
  OverviewCard,
  TopChattersCard,
  EngagementCard,
  RhythmRepliesCard,
} from "./components/cards";
import {
  handleFileUpload,
  handleFileDrop,
  handleDragOver,
} from "./utils/fileHandlers";

export default function App() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");
  const [variant] = useState("compact"); // "compact" or "story"
  const [processing, setProcessing] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [progressMessage, setProgressMessage] = useState("");
  const [progressPercent, setProgressPercent] = useState(0);
  
  // Stories mode
  const [isStoriesMode, setIsStoriesMode] = useState(false);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);

  // Keyboard navigation for Stories
  useEffect(() => {
    if (!isStoriesMode || !stats) return;

    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        setCurrentStoryIndex(prev => Math.max(0, prev - 1));
      } else if (e.key === "ArrowRight") {
        setCurrentStoryIndex(prev => Math.min(3, prev + 1)); // 4 cards total (0-3)
      } else if (e.key === "Escape") {
        setIsStoriesMode(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isStoriesMode, stats]);

  const onProgress = (message, percent = null) => {
    console.log("Progress:", message, percent ? `${percent}%` : "");
    setProgressMessage(message);
    if (percent !== null) {
      setProgressPercent(percent);
    }
  };

  const onSuccess = (data) => {
    setProcessing(false);
    setProgressMessage("");
    setProgressPercent(0);
    setUploadedFiles([]);

    // All data should now be processed into stats format
    setStats(data);
    setError("");
  };

  const onError = (errorMessage) => {
    setProcessing(false);
    setProgressMessage("");
    setProgressPercent(0);
    setUploadedFiles([]);
    setError(errorMessage);
  };

  const handleFileUploadWrapper = (event) => {
    setProcessing(true);
    setError("");

    const files = Array.from(event.target.files);
    setUploadedFiles(files.map((f) => f.name));

    handleFileUpload(event, onSuccess, onError, onProgress);
  };

  const handleFileDropWrapper = (event) => {
    setProcessing(true);
    setError("");

    const files = Array.from(event.dataTransfer.files);
    setUploadedFiles(files.map((f) => f.name));

    handleFileDrop(event, onSuccess, onError, onProgress);
  };

  const handleExportStats = () => {
    if (!stats) return;

    const exportData = {
      ...stats,
      export_info: {
        exported_at: new Date().toISOString(),
        export_version: "1.0",
        source: "Instagram Rewind App"
      }
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `instagram-rewind-${stats.rewind_year || new Date().getFullYear()}-stats.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!stats) {
    return (
      <FileUpload
        onFileUpload={handleFileUploadWrapper}
        error={error}
        onDrop={handleFileDropWrapper}
        onDragOver={handleDragOver}
        processing={processing}
        uploadedFiles={uploadedFiles}
        progressMessage={progressMessage}
        progressPercent={progressPercent}
      />
    );
  }

  const cards = [
    <OverviewCard key="ov" data={stats} variant={variant} />,
    <TopChattersCard key="tc" data={stats} variant={variant} />,
    <EngagementCard key="eg" data={stats} variant={variant} />,
    <RhythmRepliesCard key="rr" data={stats} variant={variant} />,
  ];

  return (
    <div
      className={
        "min-h-screen bg-gradient-to-br from-purple-950 " +
        "via-pink-950 to-orange-950 p-6"
      }
    >
      <div className="max-w-2xl mx-auto grid grid-cols-1 gap-6">
        <div className="text-center text-white/90 mb-2">
          <h2 className="text-2xl md:text-3xl font-semibold text-white">
            Instagram Rewind {stats.rewind_year || new Date().getFullYear()}
          </h2>
          <p className="opacity-80 text-sm mb-4">
            Shareable cards for your group chat rewind
          </p>

          <div className="flex items-center justify-center gap-4 mb-4">
            <button
              onClick={() => {
                setStats(null);
                setError("");
                setUploadedFiles([]);
                setProcessing(false);
              }}
              className={
                "px-4 py-2 rounded-lg text-sm bg-white/10 " +
                "text-slate-400 hover:text-white transition-colors"
              }
            >
              Upload New File
            </button>
            <button
              onClick={() => setIsStoriesMode(!isStoriesMode)}
              className={
                "px-4 py-2 rounded-lg text-sm " +
                (isStoriesMode 
                  ? "bg-purple-500 text-white" 
                  : "bg-white/10 text-slate-400 hover:text-white") +
                " transition-colors"
              }
            >
              {isStoriesMode ? "Exit Stories" : "View as Stories"}
            </button>
            <button
              onClick={handleExportStats}
              className={
                "px-4 py-2 rounded-lg text-sm bg-white/10 " +
                "text-slate-400 hover:text-white transition-colors"
              }
            >
              Export Stats JSON
            </button>
          </div>
        </div>
        {isStoriesMode ? (
          // Stories Mode
          <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
            {/* Progress bars */}
            <div className="absolute top-4 left-4 right-4 z-10 flex gap-1">
              {cards.map((_, index) => (
                <div
                  key={index}
                  className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden"
                >
                  <div
                    className={`h-full bg-white transition-all duration-300 ${
                      index === currentStoryIndex
                        ? "w-full"
                        : index < currentStoryIndex
                        ? "w-full"
                        : "w-0"
                    }`}
                  />
                </div>
              ))}
            </div>

            {/* Close button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsStoriesMode(false);
              }}
              className="absolute top-4 right-4 z-20 text-white hover:text-gray-300 transition-colors p-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Navigation areas */}
            <div className="absolute inset-0 z-10 flex">
              <div
                className="flex-1"
                onClick={() => setCurrentStoryIndex(Math.max(0, currentStoryIndex - 1))}
              />
              <div
                className="flex-1"
                onClick={() => setCurrentStoryIndex(Math.min(cards.length - 1, currentStoryIndex + 1))}
              />
            </div>

            {/* Story content */}
            <div className="w-full max-w-md mx-4 relative">
              {cards[currentStoryIndex]}
            </div>
          </div>
        ) : (
          // Grid Mode
          cards
        )}
      </div>
    </div>
  );
}
