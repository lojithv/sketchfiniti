import React, { createContext, useState } from 'react';

// Create the authentication context
export const AuthContext = createContext<any>(null);

// Create the authentication provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Function to handle login
    const login = () => {
        // Perform login logic here
        setIsAuthenticated(true);
    };

    // Function to handle logout
    const logout = () => {
        // Perform logout logic here
        setIsAuthenticated(false);
    };

    // Value object to be provided by the context
    const authContextValue = {
        isAuthenticated,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
};