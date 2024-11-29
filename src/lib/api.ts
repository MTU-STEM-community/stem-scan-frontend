import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const saveMatricNumber = async (matricNum: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/matric`, { matricNum });
    return response.data;
  } catch (error: unknown) {
    console.error('Failed to save matric number:', (error as Error).message);
    throw error;
  }
};

export const getMatricNumbers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/matrics`);
    return response.data;
  } catch (error: unknown) {
    console.error('Failed to fetch matric numbers:', (error as Error).message);
    throw error;
  }
};
