import React, { useState, useRef } from "react";
import { Mic, StopCircle } from "lucide-react";
import toast from "react-hot-toast";

const MAX_RECORDING_TIME = 10 * 60 * 1000; // 10 minutes in milliseconds

export default function AudioRecorder({ onRecordingComplete }) {
  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const mediaRecorder = useRef(null);
  const chunks = useRef([]);
  const recordingTimeout = useRef();
  const timerInterval = useRef();

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

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
      setTimer(0);

      // Start timer
      timerInterval.current = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);

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
      if (timerInterval.current) {
        clearInterval(timerInterval.current);
      }
      setTimer(0);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={isRecording ? stopRecording : startRecording}
        className={`flex items-center justify-center w-16 h-16 rounded-full transition-all transform hover:scale-105 ${
          isRecording
            ? "bg-red-500 hover:bg-red-600 animate-pulse"
            : "bg-blue-500 hover:bg-blue-600"
        }`}
      >
        {isRecording ? (
          <StopCircle className="w-8 h-8 text-white" />
        ) : (
          <Mic className="w-8 h-8 text-white" />
        )}
      </button>

      <div className="flex items-center gap-3">
        {isRecording && (
          <>
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-lg font-medium text-gray-700">
              {formatTime(timer)}
            </span>
          </>
        )}
      </div>

      {!isRecording && (
        <p className="text-sm text-gray-500">
          Click to start recording (max 10 minutes)
        </p>
      )}
    </div>
  );
}
