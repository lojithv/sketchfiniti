'use client'

import { app } from "@/config/firebase-config";
import { AuthContext } from "@/context/AuthContext";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import Image from "next/image";
import { useContext } from "react";

export default function Navbar() {
    const { isAuthenticated, login, logout, user } = useContext(AuthContext);


    return (
        <div className="bg-slate-900 w-full text-slate-50 p-5 flex gap-5 justify-between">
            <div>Sketchfiniti</div>
            {!isAuthenticated && <div className="flex gap-5">
                <div className="cursor-pointer" onClick={login}>Sign In</div>
            </div>}
            {isAuthenticated &&
                <div>Dashboard</div>
            }
            {isAuthenticated && (
                <div className="flex gap-5">
                    <Image className="inline-block h-8 w-8 rounded-full ring-2 ring-white" width={50} height={50} src={user.photoURL} alt="" />
                    <div className="cursor-pointer" onClick={logout}>Sign Out</div>
                </div>
            )}
        </div>
    )
}