import { createContext, useState, useContext } from 'react';
import api from '../utils/api';

export const ResumeContext = createContext();

export const ResumeProvider = ({ children }) => {
  const [resumes, setResumes] = useState([]);
  const [currentResume, setCurrentResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getResumes = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/resumes');
      setResumes(res.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to fetch resumes');
    } finally {
      setLoading(false);
    }
  };

  const getResume = async (id) => {
    setLoading(true);
    try {
      const res = await api.get(`/api/resumes/${id}`);
      setCurrentResume(res.data);
      setError(null);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to fetch resume');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createResume = async (resumeData) => {
    setLoading(true);
    try {
      const res = await api.post('/api/resumes', resumeData);
      setResumes([res.data, ...resumes]);
      setCurrentResume(res.data);
      setError(null);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to create resume');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // In ResumeContext.js
const updateResume = async (resumeData) => {
  if (!resumeData._id) return;
  setLoading(true);
  try {
    const res = await api.post(`/api/resumes/${resumeData._id}`, resumeData);
    setResumes(resumes.map(r => r._id === res.data._id ? res.data : r));
    setCurrentResume(res.data);
    setError(null);
    return res.data;
  } catch (err) {
    console.error('Update error:', err);
    setError(err.response?.data?.msg || 'Failed to update resume');
    return null;
  } finally {
    setLoading(false);
  }
};

  const deleteResume = async (id) => {
    setLoading(true);
    try {
      await api.delete(`/api/resumes/${id}`);
      setResumes(resumes.filter(r => r._id !== id));
      if (currentResume?._id === id) {
        setCurrentResume(null);
      }
      setError(null);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to delete resume');
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = async (id) => {
    try {
      const res = await api.post(`/api/resumes/${id}/pdf`, {}, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Resume_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to generate PDF');
    }
  };

  const analyzeResume = async (id) => {
    try {
      const res = await api.post(`/api/ai/${id}/analyze`);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to analyze resume');
      return null;
    }
  };

  const optimizeResume = async (id, jobDescription) => {
    try {
      const res = await api.post(`/api/ai/${id}/optimize`, jobDescription);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to optimize resume');
      return null;
    }
  };

  const generateCoverLetter = async (id, data) => {
    try {
      const res = await api.post(`/api/ai/${id}/cover-letter`, data);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to generate cover letter');
      return null;
    }
  };

  return (
    <ResumeContext.Provider
      value={{
        resumes,
        resume: currentResume,
        loading,
        error,
        getResumes,
        getResume,
        createResume,
        updateResume,
        deleteResume,
        generatePDF,
        analyzeResume,
        optimizeResume,
        generateCoverLetter,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
};

export const useResume = () => useContext(ResumeContext);