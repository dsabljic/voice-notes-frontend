import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { HiUpload } from "react-icons/hi";

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

function FileUpload({ onFileSelect }) {
  const onDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file && file.size <= MAX_FILE_SIZE) {
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "audio/mpeg": [".mp3"],
      "audio/wav": [".wav"],
      "video/mp4": [".mp4"],
    },
    maxSize: MAX_FILE_SIZE,
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
        ${
          isDragActive
            ? "border-primary bg-primary/5"
            : "border-gray-300 hover:border-primary"
        }`}
    >
      <input {...getInputProps()} />
      <HiUpload className="mx-auto h-12 w-12 text-gray-400" />
      <p className="mt-2 text-sm text-gray-600">
        Click to upload or drag and drop
      </p>
      <p className="text-xs text-gray-500">MP3, WAV, MP4 up to 20MB</p>
    </div>
  );
}

export default FileUpload;
