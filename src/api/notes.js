import axios from 'axios';

const API_URL = 'http://localhost:3000';

export const getNotes = async () => {
  const response = await axios.get(`${API_URL}/notes`);
  return response.data.notes;
};

export const getRecentNotes = async () => {
  const response = await axios.get(`${API_URL}/notes/recent`);
  return response.data.notes;
};

export const createNote = async (data) => {
  const formData = new FormData();
  formData.append('title', data.title);
  formData.append('type', data.type);
  
  if (data.audioData) {
    formData.append('audioData', data.audioData);
  }

  const response = await axios.post(`${API_URL}/notes`, formData);
  return response.data.note;
};

export const updateNote = async (id, data) => {
  await axios.put(`${API_URL}/notes/${id}`, data);
};

export const deleteNote = async (id) => {
  await axios.delete(`${API_URL}/notes/${id}`);
};