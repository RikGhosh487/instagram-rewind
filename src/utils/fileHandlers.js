export const parseStatsFile = (file, onSuccess, onError) => {
  if (!file || file.type !== "application/json") {
    onError("Please upload a valid JSON file");
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      onSuccess(data);
    } catch (err) {
      onError("Invalid JSON file");
    }
  };
  reader.readAsText(file);
};

export const handleFileUpload = (event, onSuccess, onError) => {
  const file = event.target.files[0];
  parseStatsFile(file, onSuccess, onError);
};

export const handleFileDrop = (event, onSuccess, onError) => {
  event.preventDefault();
  const file = event.dataTransfer.files[0];
  parseStatsFile(file, onSuccess, onError);
};

export const handleDragOver = (event) => {
  event.preventDefault();
};