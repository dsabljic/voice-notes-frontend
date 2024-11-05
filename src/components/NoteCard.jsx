import React from "react";
import { Trash, Edit } from "lucide-react";
import toast from "react-hot-toast";

export default function NoteCard({ note, onClick, onEdit, onDelete }) {
  const getTypeColor = () => {
    switch (note.type) {
      case "transcription":
        return "bg-blue-100 text-blue-800";
      case "summary":
        return "bg-green-100 text-green-800";
      case "list-of-ideas":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit();
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete();
  };

  return (
    <div
      onClick={onClick}
      className="group bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-200 relative"
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-medium text-gray-900 truncate flex-1 pr-16">
          {note.title}
        </h3>
        <div className="flex items-center gap-4">
          <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor()}`}>
            {note.type}
          </span>
          <div className="flex gap-2">
            <button
              onClick={handleEdit}
              className="p-1.5 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={handleDelete}
              className="p-1.5 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
            >
              <Trash className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      <p className="text-gray-600 text-sm line-clamp-2">{note.content}</p>
      <span className="text-xs text-gray-500 mt-4 block">
        {new Date(note.createdAt).toLocaleDateString()}
      </span>
    </div>
  );
}
