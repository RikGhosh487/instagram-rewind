import { useState } from "react";
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
              onClick={handleExportStats}
              className={
                "px-4 py-2 rounded-lg text-sm bg-white/10 " +
                "text-slate-400 hover:text-white transition-colors "
              }
            >
              Export Stats JSON
            </button>
          </div>
        </div>
        {cards}
      </div>
    </div>
  );
}
