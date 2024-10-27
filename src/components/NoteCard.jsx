import React from "react";
import { FileText, ListChecks, FileStack } from "lucide-react";

export default function NoteCard({ note, onClick }) {
  const getIcon = () => {
    switch (note.type) {
      case "transcription":
        return <FileText className="w-5 h-5" />;
      case "summary":
        return <FileStack className="w-5 h-5" />;
      case "list-of-ideas":
        return <ListChecks className="w-5 h-5" />;
    }
  };

  const getTypeColor = () => {
    switch (note.type) {
      case "transcription":
        return "bg-blue-100 text-blue-800";
      case "summary":
        return "bg-green-100 text-green-800";
      case "list-of-ideas":
        return "bg-purple-100 text-purple-800";
    }
  };

  return (
    <div
      onClick={onClick}
      className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-200"
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-medium text-gray-900 truncate flex-1">
          {note.title}
        </h3>
        <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor()}`}>
          {note.type}
        </span>
      </div>
      <p className="text-gray-600 text-sm line-clamp-2">{note.content}</p>
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center text-gray-500">{getIcon()}</div>
        <span className="text-xs text-gray-500">
          {new Date(note.createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}
