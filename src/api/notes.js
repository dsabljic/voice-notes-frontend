import axios from "axios";

const API_URL = "http://localhost:3000";

const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getNotes = async (page = 1, pageSize = 10) => {
  const response = await axios.get(
    `${API_URL}/notes?page=${page}&pageSize=${pageSize}`,
    getAuthHeader()
  );
  return response.data.notes;
};

export const getRecentNotes = async () => {
  const response = await axios.get(`${API_URL}/notes/recent`, getAuthHeader());
  return response.data.notes;
};

export const getNoteById = async (id) => {
  const response = await axios.get(`${API_URL}/notes/${id}`, getAuthHeader());
  return response.data.note;
};

export const createNote = async (data) => {
  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("type", data.type);
  formData.append("isRecording", String(data.isRecording));

  if (data.audioData) {
    // Convert base64 to blob
    const byteCharacters = atob(data.audioData);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "audio/mpeg" }); // Changed to audio/mpeg

    formData.append("audio", blob, "recording.mp3");
  }

  const response = await axios.post(`${API_URL}/notes`, formData, {
    ...getAuthHeader(),
    headers: {
      ...getAuthHeader().headers,
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data.note;
};

export const updateNote = async (id, data) => {
  const response = await axios.patch(
    `${API_URL}/notes/${id}`,
    data,
    getAuthHeader()
  );
  return response.data;
};

export const deleteNote = async (id) => {
  const response = await axios.delete(
    `${API_URL}/notes/${id}`,
    getAuthHeader()
  );
  return response.data;
};
