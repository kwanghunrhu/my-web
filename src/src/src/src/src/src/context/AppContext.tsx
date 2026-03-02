import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project, ThemeConfig } from '../types';
import { INITIAL_PROJECTS, DEFAULT_THEME } from '../constants';

interface AppContextType {
  projects: Project[];
  theme: ThemeConfig;
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  updateTheme: (theme: Partial<ThemeConfig>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [theme, setTheme] = useState<ThemeConfig>(DEFAULT_THEME);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('oleum_auth') === 'true';
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, themeRes] = await Promise.all([
          fetch('/api/projects'),
          fetch('/api/theme')
        ]);
        if (projectsRes.ok) {
          const projectsData = await projectsRes.json();
          if (projectsData.length > 0) setProjects(projectsData);
        }
        if (themeRes.ok) {
          const themeData = await themeRes.json();
          if (themeData) setTheme(themeData);
        }
      } catch (error) {}
    };
    fetchData();
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty('--primary-color', theme.primaryColor);
    document.documentElement.style.setProperty('--font-family', theme.fontFamily === 'serif' ? 'serif' : theme.fontFamily === 'mono' ? 'monospace' : 'sans-serif');
  }, [theme]);

  const login = (password: string) => {
    if (password === 'admin123') {
      setIsAuthenticated(true);
      localStorage.setItem('oleum_auth', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('oleum_auth');
  };

  const addProject = async (project: Omit<Project, 'id'>) => {
    const newProject = { ...project, id: Date.now().toString() };
    try {
      await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProject)
      });
      setProjects(prev => [newProject, ...prev]);
    } catch (error) {}
  };

  const updateProject = async (id: string, updatedFields: Partial<Project>) => {
    const project = projects.find(p => p.id === id);
    if (!project) return;
    const updatedProject = { ...project, ...updatedFields };
    try {
      await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProject)
      });
      setProjects(prev => prev.map(p => p.id === id ? updatedProject : p));
    } catch (error) {}
  };

  const deleteProject = async (id: string) => {
    try {
      await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (error) {}
  };

  const updateTheme = async (newTheme: Partial<ThemeConfig>) => {
    const updatedTheme = { ...theme, ...newTheme };
    try {
      await fetch('/api/theme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTheme)
      });
      setTheme(updatedTheme);
    } catch (error) {}
  };

  return (
    <AppContext.Provider value={{
      projects, theme, isAuthenticated, login, logout,
      addProject, updateProject, deleteProject, updateTheme
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
