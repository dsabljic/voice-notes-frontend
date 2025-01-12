import { useState, useEffect } from "react";
import { Upload, Mic } from "lucide-react";
import AudioRecorder from "../components/AudioRecorder";
import NoteCard from "../components/NoteCard";
import CreateNoteModal from "../components/CreateNoteModal";
import NoteModal from "../components/NoteModal";
import DeleteNoteModal from "../components/DeleteNoteModal";
import { getRecentNotes, getNoteById, deleteNote } from "../api/notes";
import toast from "react-hot-toast";

export default function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [noteToEdit, setNoteToEdit] = useState(null);
  const [audioData, setAudioData] = useState();
  const [isRecording, setIsRecording] = useState();

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const fetchedNotes = await getRecentNotes();
      setNotes(fetchedNotes);
    } catch (error) {
      toast.error("Failed to fetch notes");
    }
  };

  const handleFileUpload = (event) => {
    event.preventDefault();

    let file = null;

    if ("dataTransfer" in event) {
      file = event.dataTransfer.files[0];
    } else if (event.target.files) {
      file = event.target.files[0];
    }

    if (file) {
      if (file.size > 20 * 1024 * 1024) {
        toast.error("File size must be less than 20MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Audio = reader.result;
        setIsRecording("false");
        setAudioData(base64Audio.split(",")[1]);
        setShowCreateModal(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleRecordingComplete = (audioData) => {
    setIsRecording("true");
    setAudioData(audioData);
    setShowCreateModal(true);
  };

  const handleNoteClick = async (noteId) => {
    try {
      const note = await getNoteById(noteId);
      setSelectedNote(note);
    } catch (error) {
      toast.error("Failed to fetch note details");
    }
  };

  const handleDeleteNote = async (note) => {
    setNoteToDelete(note);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <Upload className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-semibold">Upload Recording</h2>
          </div>
          <label
            onDrop={handleFileUpload}
            onDragOver={handleDragOver}
            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag
                and drop
              </p>
              <p className="text-xs text-gray-500">MP3, WAV, MP4 up to 20MB</p>
            </div>
            <input
              type="file"
              className="hidden"
              accept="audio/*"
              onChange={handleFileUpload}
            />
          </label>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <Mic className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-semibold">Record Voice Note</h2>
          </div>
          <div className="flex items-center justify-center h-32">
            <AudioRecorder onRecordingComplete={handleRecordingComplete} />
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Notes</h2>
        {!notes.length && (
          <div className="text-center py-12">
            <p className="text-gray-500">You currently have no notes!</p>
          </div>
        )}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onClick={() => handleNoteClick(note.id)}
              onEdit={() => setNoteToEdit(note)}
              onDelete={() => handleDeleteNote(note)}
            />
          ))}
        </div>
      </div>

      {showCreateModal && (
        <CreateNoteModal
          audioData={audioData}
          isRecording={isRecording}
          onClose={() => {
            setShowCreateModal(false);
            setAudioData(undefined);
          }}
          onSuccess={fetchNotes}
        />
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
