import React, { useState, useRef } from "react";
import { Mic, Square } from "lucide-react";
import toast from "react-hot-toast";

const MAX_RECORDING_TIME = 10 * 60 * 1000; // 10 minutes in milliseconds

export default function AudioRecorder({ onRecordingComplete }) {
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorder = useRef(null);
  const chunks = useRef([]);
  const recordingTimeout = useRef();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      chunks.current = [];

      mediaRecorder.current.ondataavailable = (e) => {
        chunks.current.push(e.data);
      };

      mediaRecorder.current.onstop = () => {
        const blob = new Blob(chunks.current, { type: "audio/mp3" });

        // Check file size (20MB = 20 * 1024 * 1024 bytes)
        if (blob.size > 20 * 1024 * 1024) {
          toast.error("Recording exceeds 20MB limit");
          return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          const base64Audio = reader.result;
          onRecordingComplete(base64Audio.split(",")[1]);
        };

        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.current.start();
      setIsRecording(true);

      // Set timeout to stop recording after 10 minutes
      recordingTimeout.current = setTimeout(() => {
        if (mediaRecorder.current?.state === "recording") {
          stopRecording();
          toast.error("Recording limit of 10 minutes reached");
        }
      }, MAX_RECORDING_TIME);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      toast.error("Failed to access microphone");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      setIsRecording(false);
      if (recordingTimeout.current) {
        clearTimeout(recordingTimeout.current);
      }
    }
  };

  return (
    <div className="flex items-center gap-4">
      {isRecording ? (
        <button
          onClick={stopRecording}
          className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
        >
          <Square className="w-5 h-5" />
          Stop Recording
        </button>
      ) : (
        <button
          onClick={startRecording}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Mic className="w-5 h-5" />
          Start Recording
        </button>
      )}
      {isRecording && (
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          Recording...
        </div>
      )}
    </div>
  );
}
