// File validation utilities for Instagram Rewind

// Validate if a JSON object is a raw Instagram message file
export const isInstagramMessageFile = (data) => {
  return (
    data &&
    typeof data === "object" &&
    Array.isArray(data.participants) &&
    Array.isArray(data.messages) &&
    typeof data.title === "string" &&
    data.participants.length > 0 &&
    data.participants.every((p) => p.name) &&
    data.messages.every((m) => m.sender_name && m.timestamp_ms)
  );
};

// Validate if a JSON object is a processed stats file
export const isProcessedStatsFile = (data) => {
  return (
    data &&
    typeof data === "object" &&
    typeof data.total_messages === "number" &&
    data.per_sender &&
    typeof data.per_sender === "object"
  );
};

// Check if all Instagram message files have the same participants and title
export const validateSameConversation = (instagramFiles) => {
  if (instagramFiles.length <= 1) return { valid: true };

  const firstFile = instagramFiles[0].data;
  const firstFileParticipants = firstFile.participants
    .map((p) => p.name)
    .sort();
  const firstFileTitle = firstFile.title;

  for (let i = 1; i < instagramFiles.length; i++) {
    const currentFile = instagramFiles[i].data;
    const currentFileParticipants = currentFile.participants
      .map((p) => p.name)
      .sort();
    const currentFileTitle = currentFile.title;

    // Check if titles match
    if (firstFileTitle !== currentFileTitle) {
      return {
        valid: false,
        reason: "title_mismatch",
        expected: firstFileTitle,
        found: currentFileTitle,
        file: instagramFiles[i].filename,
      };
    }

    // Check if participant count matches
    if (firstFileParticipants.length !== currentFileParticipants.length) {
      return {
        valid: false,
        reason: "participant_count_mismatch",
        expectedCount: firstFileParticipants.length,
        foundCount: currentFileParticipants.length,
        file: instagramFiles[i].filename,
      };
    }

    // Check if all participant names match
    for (let j = 0; j < firstFileParticipants.length; j++) {
      if (firstFileParticipants[j] !== currentFileParticipants[j]) {
        return {
          valid: false,
          reason: "participant_name_mismatch",
          expected: firstFileParticipants,
          found: currentFileParticipants,
          file: instagramFiles[i].filename,
        };
      }
    }
  }

  return { valid: true };
};