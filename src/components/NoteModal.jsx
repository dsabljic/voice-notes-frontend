import { useState, useEffect } from "react";
import { X, Save, Trash } from "lucide-react";
import { updateNote, deleteNote } from "../api/notes";
import toast from "react-hot-toast";
import DeleteNoteModal from "./DeleteNoteModal";

export default function NoteModal({ note, onClose, onUpdate }) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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
    try {
      await updateNote(note.id, { title, content });
      toast.success("Note updated successfully");
      onUpdate();
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update note");
    }
  };

  const handleDelete = async () => {
    setShowDeleteModal(true);
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <dialog
          open
          className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4 border-b flex items-center justify-between">
            {isEditing ? (
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-xl font-semibold w-full outline-none"
              />
            ) : (
              <h2 className="text-xl font-semibold">{title}</h2>
            )}
            <div className="flex items-center gap-2">
              {isEditing ? (
                <button
                  onClick={handleSave}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <Save className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-sm px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Edit
                </button>
              )}
              <button
                onClick={handleDelete}
                className="p-2 hover:bg-gray-100 rounded-full text-red-500"
              >
                <Trash className="w-5 h-5" />
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
            {isEditing ? (
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full h-96 p-2 border rounded-lg outline-none resize-none"
              />
            ) : (
              <div className="prose max-w-none">
                {content.split("\n").map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            )}
          </div>
        </dialog>
      </div>

      {showDeleteModal && (
        <DeleteNoteModal
          onClose={() => setShowDeleteModal(false)}
          onConfirm={async () => {
            try {
              await deleteNote(note.id);
              toast.success("Note deleted successfully");
              onUpdate();
              onClose();
            } catch (error) {
              toast.error("Failed to delete note");
            }
          }}
        />
      )}
    </>
  );
}
