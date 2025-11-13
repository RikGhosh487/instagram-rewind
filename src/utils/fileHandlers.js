// Import modules for cleaner organization
import { 
  isInstagramMessageFile, 
  isProcessedStatsFile, 
  validateSameConversation 
} from './validation.js';
import { processInstagramFiles } from './messageProcessor.js';
import { readMultipleJsonFiles } from './fileReaders.js';

// Process multiple files
export const parseMultipleFiles = async (
  files,
  onSuccess,
  onError,
  onProgress = null
) => {
  if (!files || files.length === 0) {
    onError("Please select at least one JSON file");
    return;
  }

  // Validate file types
  const invalidFiles = Array.from(files).filter(
    (file) =>
      !file.name.endsWith(".json") || file.type !== "application/json"
  );

  if (invalidFiles.length > 0) {
    onError(
      `Invalid file types: ${invalidFiles
        .map((f) => f.name)
        .join(", ")}. Please upload only JSON files.`
    );
    return;
  }

  try {
    onProgress && onProgress("Reading files...", 5);

    // Read all files
    const fileResults = await readMultipleJsonFiles(files);

    onProgress && onProgress("Validating file formats...", 15);

    // Check if all files are Instagram message files
    const instagramFiles = fileResults.filter((result) =>
      isInstagramMessageFile(result.data)
    );
    const processedFiles = fileResults.filter((result) =>
      isProcessedStatsFile(result.data)
    );
    const unknownFiles = fileResults.filter(
      (result) =>
        !isInstagramMessageFile(result.data) &&
        !isProcessedStatsFile(result.data)
    );

    if (unknownFiles.length > 0) {
      onError(
        `Unrecognized file format in: ${unknownFiles
          .map((f) => f.filename)
          .join(
            ", "
          )}. Please upload Instagram message files or processed stats JSON.`
      );
      return;
    }

    // Can't mix file types
    if (instagramFiles.length > 0 && processedFiles.length > 0) {
      onError(
        "Cannot mix raw Instagram files and processed stats files. " +
          "Please upload only one type."
      );
      return;
    }

    // Handle processed stats file (should be only one)
    if (processedFiles.length > 0) {
      if (processedFiles.length > 1) {
        onError(
          "Multiple processed stats files detected. " +
            "Please upload only one processed stats file."
        );
        return;
      }
      onProgress && onProgress("Loading processed stats...", 100);
      onSuccess(processedFiles[0].data);
      return;
    }

    // Handle Instagram message files
    if (instagramFiles.length > 0) {
      onProgress && onProgress("Validating conversation consistency...", 25);

      // Validate that all Instagram files are from the same conversation
      const validationResult = validateSameConversation(instagramFiles);
      if (!validationResult.valid) {
        let errorMessage = "Files appear to be from different conversations. ";
        
        switch (validationResult.reason) {
          case "title_mismatch":
            errorMessage += 
              `Chat titles don't match. Expected: "${validationResult.expected}" ` +
              `but found: "${validationResult.found}" in file ` +
              `"${validationResult.file}". `;
            break;
          case "participant_count_mismatch":
            errorMessage += 
              `Different number of participants. Expected: ` +
              `${validationResult.expectedCount} people, but found: ` +
              `${validationResult.foundCount} people in file ` +
              `"${validationResult.file}". `;
            break;
          case "participant_name_mismatch":
            errorMessage += 
              `Different participants. Expected: ` +
              `${validationResult.expected.join(", ")}, but found: ` +
              `${validationResult.found.join(", ")} in file ` +
              `"${validationResult.file}". `;
            break;
        }
        
        errorMessage += 
          "Please ensure all uploaded files are from the same conversation.";
        
        onError(errorMessage);
        return;
      }

      onProgress && onProgress("Processing Instagram data...", 40);

      try {
        // Process the raw Instagram files into stats format
        const processedStats = processInstagramFiles(instagramFiles, onProgress);
        onProgress && onProgress("Finalizing data...", 100);
        onSuccess(processedStats);
      } catch (error) {
        onError(`Error processing Instagram data: ${error.message}`);
      }
      return;
    }

    onError(
      "No valid files found. Please upload Instagram message files or " +
        "a processed stats JSON file."
    );
  } catch (error) {
    onError(`Error processing files: ${error.message}`);
  }
};

// Legacy single file parser for backward compatibility
export const parseStatsFile = (file, onSuccess, onError) => {
  parseMultipleFiles([file], onSuccess, onError);
};

export const handleFileUpload = (
  event,
  onSuccess,
  onError,
  onProgress = null
) => {
  const files = event.target.files;
  parseMultipleFiles(files, onSuccess, onError, onProgress);
};

export const handleFileDrop = (
  event,
  onSuccess,
  onError,
  onProgress = null
) => {
  event.preventDefault();
  const files = event.dataTransfer.files;
  parseMultipleFiles(files, onSuccess, onError, onProgress);
};

export const handleDragOver = (event) => {
  event.preventDefault();
};