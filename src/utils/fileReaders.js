// File reading utilities module

// Read and parse a JSON file
export const readJsonFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target.result);
        resolve({
          name: file.name,
          data: jsonData,
          size: file.size
        });
      } catch (error) {
        reject(new Error(`Failed to parse JSON in file "${file.name}": ${error.message}`));
      }
    };
    
    reader.onerror = () => {
      reject(new Error(`Failed to read file "${file.name}"`));
    };
    
    reader.readAsText(file);
  });
};

// Read multiple files and return their parsed JSON data
export const readMultipleJsonFiles = async (files) => {
  const promises = Array.from(files).map(file => readJsonFile(file));
  
  try {
    const results = await Promise.all(promises);
    return results;
  } catch (error) {
    throw new Error(`Error reading files: ${error.message}`);
  }
};