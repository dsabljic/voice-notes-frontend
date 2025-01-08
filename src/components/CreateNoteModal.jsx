import React, { useState } from "react";
import { X } from "lucide-react";
import { createNote } from "../api/notes";
import toast from "react-hot-toast";

export default function CreateNoteModal({
  audioData,
  isRecording,
  onClose,
  onSuccess,
}) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("transcription");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await createNote({
        title,
        type,
        audioData,
        isRecording,
      });
      toast.success("Note created successfully");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error("Failed to create note");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-xl font-semibold">Create New Note</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Note Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full p-2 border rounded-lg"
            >
              <option value="transcription">Transcription</option>
              <option value="summary">Summary</option>
              <option value="list-of-ideas">List of Ideas</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {isLoading ? "Creating..." : "Create Note"}
          </button>
        </form>
      </div>
    </div>
  );
}
