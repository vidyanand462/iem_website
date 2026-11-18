import React, { createContext, useContext, useState } from 'react';
import applicationService from '../services/application.service';

export const ApplicationContext = createContext(null);

export const ApplicationProvider = ({ children }) => {
  const [activeApplication, setActiveApplication] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchApplication = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const res = await applicationService.getApplicationById(id);
      setActiveApplication(res.data);
      return res.data;
    } catch (err) {
      setError(err.message || 'Failed to load application');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const refreshApplication = async () => {
    if (activeApplication?.id || activeApplication?.application_id) {
      return fetchApplication(activeApplication.id || activeApplication.application_id);
    }
  };

  const value = {
    activeApplication,
    setActiveApplication,
    fetchApplication,
    refreshApplication,
    loading,
    error,
  };

  return <ApplicationContext.Provider value={value}>{children}</ApplicationContext.Provider>;
};

export const useApplication = () => {
  const context = useContext(ApplicationContext);
  if (!context) {
    throw new Error('useApplication must be used within an ApplicationProvider');
  }
  return context;
};

export default ApplicationContext;
