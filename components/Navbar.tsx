'use client'

import { AuthContext } from "@/context/AuthContext";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";

export default function Navbar() {
    const { isAuthenticated, login, logout, user } = useContext(AuthContext);
    const [menuOpened, setMenuOpened] = useState(false);

    const router = useRouter();

    const currentPage = usePathname();

    const handleMenuState = () => {
        setMenuOpened(!menuOpened);
    }

    const handleMenuItemClick = (item: string) => {

        setMenuOpened(false);
        if (item === 'signout') {
            logout();
        }
    }

    const handleNavigate = (path: string) => {
        router.push(path);
    }

    useEffect(() => {
        const handleOutSideClick = (event: { target: any; }) => {
            if (menuOpened)
                setMenuOpened(false);
        };

        window.addEventListener("mousedown", handleOutSideClick);

        return () => {
            window.removeEventListener("mousedown", handleOutSideClick);
        };
    }, []);

    return (
        <div className="bg-slate-900 w-full text-slate-50 p-2 flex gap-5 justify-between items-center">
            <div className="font-bold text-lg">Prod</div>
            {!isAuthenticated && <div className="flex gap-5">
                <div className="cursor-pointer" onClick={login}>Sign In</div>
            </div>}
            {isAuthenticated && (
                <div className="flex gap-5 relative items-center">
                    {currentPage !== '/dashboard' && <div className="cursor-pointer" onClick={() => handleNavigate('/dashboard')}>Dashboard</div>}
                    <div className="relative">
                        <Image className="inline-block h-8 w-8 rounded-full ring-2 ring-white" width={50} height={50} src={user.photoURL} alt="" onClick={handleMenuState} />
                        {menuOpened && (
                            <div className="absolute right-0 z-200 mt-4 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button">
                                <div className="py-1" role="none">
                                    <a href="#" className="text-gray-700 block px-4 py-2 text-sm" role="menuitem" id="menu-item-0">Account settings</a>
                                    <a href="#" className="text-gray-700 block px-4 py-2 text-sm" role="menuitem" id="menu-item-1">Support</a>
                                    <a href="#" className="text-gray-700 block px-4 py-2 text-sm" role="menuitem" id="menu-item-2">Report</a>
                                    <button className="text-gray-700 block w-full px-4 py-2 text-left text-sm" onClick={(e) => { e.stopPropagation(); handleMenuItemClick('signout'); }}>Sign out</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}