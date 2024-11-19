// lib/mockAuth.ts
export interface User {
    email: string;
    isLoggedIn: boolean;
  }
  
  export const checkAuth = (): boolean => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('isLoggedIn') === 'true';
  };
  
  export const mockLogin = (email: string, password: string): boolean => {
    // In a real app, you'd validate against a backend
    if (email && password) {
      localStorage.setItem('isLoggedIn', 'true');
      return true;
    }
    return false;
  };
  
  export const mockLogout = (): void => {
    localStorage.removeItem('isLoggedIn');
  };