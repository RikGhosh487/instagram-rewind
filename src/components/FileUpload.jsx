import { Upload } from "lucide-react";

function FileUpload({ onFileUpload, error, onDrop, onDragOver }) {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="max-w-lg w-full">
        <div className="text-center text-slate-300 mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            Instagram Rewind Cards
          </h2>
          <p className="opacity-80">
            Upload your stats JSON to generate beautiful cards
          </p>
        </div>

        <div
          className={
            "border-2 border-dashed border-slate-600 rounded-xl p-12 " +
            "text-center bg-slate-900/50 backdrop-blur-sm"
          }
          onDrop={onDrop}
          onDragOver={onDragOver}
        >
          <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <input
            type="file"
            accept=".json"
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
            Upload Stats JSON
          </label>
          <p className="text-slate-400 mt-4 text-sm">
            Or drag and drop your JSON file here
          </p>
          {error && <p className="text-red-400 mt-4">{error}</p>}
        </div>
      </div>
    </div>
  );
}

export default FileUpload;