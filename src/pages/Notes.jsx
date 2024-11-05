import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import NoteCard from "../components/NoteCard";
import NoteModal from "../components/NoteModal";
import DeleteNoteModal from "../components/DeleteNoteModal";
import { getNotes, deleteNote } from "../api/notes";
import toast from "react-hot-toast";

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [noteToEdit, setNoteToEdit] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [sortBy, setSortBy] = useState("created-desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  useEffect(() => {
    fetchNotes();
  }, [currentPage, pageSize]);

  const fetchNotes = async () => {
    try {
      const fetchedNotes = await getNotes(currentPage, pageSize);
      setNotes(fetchedNotes);
    } catch (error) {
      toast.error("Failed to fetch notes");
    }
  };

  const sortNotes = (notesToSort) => {
    return [...notesToSort].sort((a, b) => {
      switch (sortBy) {
        case "created-desc":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "created-asc":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "updated-desc":
          return new Date(b.updatedAt) - new Date(a.updatedAt);
        case "updated-asc":
          return new Date(a.updatedAt) - new Date(b.updatedAt);
        default:
          return 0;
      }
    });
  };

  const filteredNotes = sortNotes(
    notes.filter((note) => {
      const matchesSearch = note.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesType = selectedType === "all" || note.type === selectedType;
      return matchesSearch && matchesType;
    })
  );

  const handleDeleteNote = async (note) => {
    setNoteToDelete(note);
  };

  const loadMoreNotes = () => {
    setCurrentPage((prev) => prev + 1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-2xl font-bold text-gray-900">All Notes</h1>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full"
            />
          </div>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white"
          >
            <option value="all">All Types</option>
            <option value="transcription">Transcription</option>
            <option value="summary">Summary</option>
            <option value="list-of-ideas">List of Ideas</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg bg-white"
          >
            <option value="created-desc">Newest First</option>
            <option value="created-asc">Oldest First</option>
            <option value="updated-desc">Recently Updated</option>
            <option value="updated-asc">Least Recently Updated</option>
          </select>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNotes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            onClick={() => setSelectedNote(note)}
            onEdit={() => setNoteToEdit(note)}
            onDelete={() => handleDeleteNote(note)}
          />
        ))}
      </div>

      {filteredNotes.length === pageSize && (
        <div className="mt-8 text-center">
          <button
            onClick={loadMoreNotes}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Load More
          </button>
        </div>
      )}

      {filteredNotes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            No notes found matching your criteria.
          </p>
        </div>
      )}

      {selectedNote && (
        <NoteModal
          note={selectedNote}
          onClose={() => setSelectedNote(null)}
          onUpdate={fetchNotes}
        />
      )}

      {noteToEdit && (
        <NoteModal
          note={noteToEdit}
          onClose={() => setNoteToEdit(null)}
          onUpdate={fetchNotes}
          isEditing={true}
        />
      )}

      {noteToDelete && (
        <DeleteNoteModal
          onClose={() => setNoteToDelete(null)}
          onConfirm={async () => {
            try {
              await deleteNote(noteToDelete.id);
              toast.success("Note deleted successfully");
              await fetchNotes();
              setNoteToDelete(null);
            } catch (error) {
              toast.error("Failed to delete note");
            }
          }}
        />
      )}
    </div>
  );
}
