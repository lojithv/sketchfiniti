'use client'

import { app } from "@/config/firebase-config";
import { AuthContext } from "@/context/AuthContext";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import Image from "next/image";
import { useContext, useState } from "react";

export default function Navbar() {
    const { isAuthenticated, login, logout, user } = useContext(AuthContext);
    const [menuOpened, setMenuOpened] = useState(false);

    const handleMenuState = () => {
        setMenuOpened(!menuOpened);
    }

    const handleMenuItemClick = (item: string) => {
        setMenuOpened(false);
        if (item === 'signout') {
            logout();
        }
    }

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
                <div className="flex gap-5 relative">
                    <Image className="inline-block h-8 w-8 rounded-full ring-2 ring-white" width={50} height={50} src={user.photoURL} alt="" onClick={handleMenuState} />
                    {menuOpened && (
                        <div className="absolute right-0 z-10 mt-10 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button">
                            <div className="py-1" role="none">
                                <a href="#" className="text-gray-700 block px-4 py-2 text-sm" role="menuitem" id="menu-item-0">Account settings</a>
                                <a href="#" className="text-gray-700 block px-4 py-2 text-sm" role="menuitem" id="menu-item-1">Support</a>
                                <a href="#" className="text-gray-700 block px-4 py-2 text-sm" role="menuitem" id="menu-item-2">Report</a>

                                <button className="text-gray-700 block w-full px-4 py-2 text-left text-sm" onClick={() => handleMenuItemClick('signout')}>Sign out</button>

                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}