"use client"

import { app } from '@/config/firebase-config';
import { signInWithPopup, getAuth, GoogleAuthProvider, User } from 'firebase/auth';
import { set } from 'firebase/database';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import React, { createContext, useEffect, useState } from 'react';

// Create the authentication context
export const AuthContext = createContext<any>(null);

// Create the authentication provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const router = useRouter();

    const searchParams = useSearchParams()

    const currentPage = usePathname();

    const prId = searchParams.get('pr')

    const provider = new GoogleAuthProvider();
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        // Perform the logic to check if the user is authenticated
        // If the user is authenticated, set the state of the user
        // If the user is not authenticated, set the state of the user to null
        // Set the state of isAuthenticated to true or false
        getAuth(app).onAuthStateChanged((user) => {
            console.log(user);
            if (user && user.uid) {
                setIsAuthenticated(true);
                setUser(user);
                console.log('prId', prId);
                console.log('currentPage', currentPage);
                if (currentPage == '/editor' && !prId) {
                    router.push('/editor?pr=offline');
                }
            } else {
                setIsAuthenticated(false);
                setUser(null);
                console.log('prId', prId);
                if (currentPage == '/dashboard') {
                    // router.push('/');
                } else if (currentPage == '/editor' && !prId) {
                    router.push('/editor?pr=offline');
                }
            }
        });
    }, []);

    // Function to handle login
    const login = () => {
        signInWithPopup(getAuth(app), provider).then((result) => {
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential?.accessToken;
            const user = result.user;
            if (user.uid) {
                setIsAuthenticated(true);
                setUser(user)
            }
        }).catch((error) => {
            console.error(error);
        });
    };

    // Function to handle logout
    const logout = () => {
        // Perform logout logic here
        console.log('logout');
        getAuth(app).signOut();
        setIsAuthenticated(false);
        router.push('/');
    };

    // Value object to be provided by the context
    const authContextValue = {
        user,
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