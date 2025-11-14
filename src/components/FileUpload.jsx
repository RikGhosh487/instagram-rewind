import { Upload, FileText } from "lucide-react";

function FileUpload({
  onFileUpload,
  error,
  onDrop,
  onDragOver,
  processing = false,
  uploadedFiles = [],
  progressMessage = "",
  progressPercent = 0,
}) {
  return (
    <div className={
      "min-h-screen bg-slate-950 flex items-center " +
      "justify-center p-6"
    }>
      <div className="max-w-lg w-full">
        <div className="text-center text-slate-300 mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            Instagram Rewind Cards
          </h2>
          <p className="opacity-80">
            Upload your Instagram message files or processed stats JSON
          </p>
        </div>

        <div
          className={
            "border-2 border-dashed border-slate-600 rounded-xl p-12 " +
            "text-center bg-slate-900/50 backdrop-blur-sm " +
            "transition-colors " +
            (processing ? "border-blue-500/50 bg-blue-950/20" : "")
          }
          onDrop={onDrop}
          onDragOver={onDragOver}
        >
          <Upload
            className={`w-12 h-12 mx-auto mb-4 ${
              processing ? "text-blue-400 animate-pulse" : "text-slate-400"
            }`}
          />

          {!processing && (
            <>
              <input
                type="file"
                accept=".json"
                multiple
                onChange={onFileUpload}
                className="hidden"
                id="file-input"
              />
              <label
                htmlFor="file-input"
                className={
                  "inline-flex items-center gap-2 px-6 py-3 " +
                  "bg-white/10 hover:bg-white/20 rounded-lg text-white " +
                  "cursor-pointer transition-colors"
                }
              >
                Upload JSON Files
              </label>
              <p className="text-slate-400 mt-4 text-sm">
                Select multiple message_X.json files from Instagram export
                <br />
                or a single processed stats JSON file
              </p>
            </>
          )}

          {processing && (
            <div className="text-blue-400">
              <p className="font-medium">Processing files...</p>
              
              {/* Progress bar */}
              {progressPercent > 0 && (
                <div className="w-full bg-slate-700 rounded-full h-2 mt-3 mb-2">
                  <div
                    className={
                      "bg-blue-500 h-2 rounded-full transition-all " +
                      "duration-300 ease-out"
                    }
                    style={{ width: `${Math.min(progressPercent, 100)}%` }}
                  />
                </div>
              )}
              
              {/* Progress message */}
              {progressMessage && (
                <p className="text-sm mt-2 text-blue-300">{progressMessage}</p>
              )}
              
              {!progressMessage && (
                <p className="text-sm mt-2">Analyzing your Instagram data</p>
              )}
              
              {/* Percentage indicator */}
              {progressPercent > 0 && (
                <p className="text-xs mt-1 text-slate-400">
                  {Math.min(progressPercent, 100)}% complete
                </p>
              )}
            </div>
          )}

          {uploadedFiles.length > 0 && !processing && (
            <div className="mt-6 p-4 bg-slate-800/50 rounded-lg">
              <h4 className="text-white font-medium mb-3 text-sm">
                Uploaded Files:
              </h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {uploadedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-xs text-slate-300"
                  >
                    <FileText className="w-3 h-3" />
                    <span className="truncate">{file}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {error && <p className="text-red-400 mt-4">{error}</p>}
        </div>

        {/* Instructions for getting Instagram data */}
        <div className={
          "mt-6 p-4 bg-blue-950/20 border border-blue-500/30 " +
          "rounded-lg text-sm text-slate-300"
        }>
          <h3 className="font-semibold text-blue-400 mb-3 flex items-center">
            <svg 
              className="w-4 h-4 mr-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
            How to get your Instagram message files:
          </h3>
          <ol className="space-y-2 text-xs leading-relaxed">
            <li className="flex">
              <span className="font-medium text-blue-400 mr-2">1.</span>
              <span>
                Go to{" "}
                <a 
                  href="https://accountscenter.instagram.com/?theme=dark&entry_point=app_settings"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  Instagram Accounts Center
                </a>
              </span>
            </li>
            <li className="flex">
              <span className="font-medium text-blue-400 mr-2">2.</span>
              <span>Click on "Your information and permissions"</span>
            </li>
            <li className="flex">
              <span className="font-medium text-blue-400 mr-2">3.</span>
              <span>Select "Export your information"</span>
            </li>
            <li className="flex">
              <span className="font-medium text-blue-400 mr-2">4.</span>
              <span>Click "Create export" → "Export to device"</span>
            </li>
            <li className="flex">
              <span className="font-medium text-blue-400 mr-2">5.</span>
              <div>
                <span className="block mb-1">Customize your export:</span>
                <ul className="ml-4 space-y-1 text-slate-400">
                  <li>• Information: Select only "Messages"</li>
                  <li>• Date range: Jan 1, 2025 - [current date] (or your preferred year)</li>
                  <li>• Format: <strong className="text-white">JSON</strong> (required)</li>
                  <li>• Media quality: Lower quality (saves space)</li>
                </ul>
              </div>
            </li>
            <li className="flex">
              <span className="font-medium text-blue-400 mr-2">6.</span>
              <span>
                Wait for the export to be ready (usually a few minutes), 
                then download the ZIP file
              </span>
            </li>
            <li className="flex">
              <span className="font-medium text-blue-400 mr-2">7.</span>
              <span>
                Extract the ZIP and navigate to:
                <br />
                <code className="bg-slate-700 px-1 rounded text-xs block mt-1">
                  [unzipped]/messages/inbox/[chat]/
                </code>
              </span>
            </li>
            <li className="flex">
              <span className="font-medium text-blue-400 mr-2">8.</span>
              <span>
                Upload all message_*.json files from that folder 
                (message_1.json, message_2.json, etc.)
              </span>
            </li>
          </ol>
        </div>

        <div className={
          "mt-6 p-4 bg-slate-800/30 rounded-lg text-xs " +
          "text-slate-400"
        }>
          <p className="font-medium text-white mb-2">Supported formats:</p>
          <ul className="space-y-1">
            <li>
              • Raw Instagram message files (message_1.json, message_2.json,
              etc.)
            </li>
            <li>• Exported stats JSON (downloaded from this app)</li>
            <li>• Pre-processed stats JSON (from previous versions)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default FileUpload;
