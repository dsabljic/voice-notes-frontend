import React, { useState, useEffect } from "react";
import { X, Save } from "lucide-react";
import { updateNote } from "../api/notes";
import toast from "react-hot-toast";

export default function EditNoteModal({ note, onClose, onUpdate }) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await updateNote(note.id, { title, content });
      toast.success("Note updated successfully");
      onUpdate();
      onClose();
    } catch (error) {
      toast.error("Failed to update note");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <dialog
        open
        className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-hidden relative z-50"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b flex items-center justify-between">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-xl font-semibold w-full outline-none"
          />
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <Save className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-96 p-2 border rounded-lg outline-none resize-none"
          />
        </div>
      </dialog>
    </div>
  );
}
