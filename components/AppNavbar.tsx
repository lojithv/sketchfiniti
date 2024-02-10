"use client"
import React from 'react';

type Props = {

}

const AppNavbar = ({ }: Props) => {

    return (
        <nav className='bg-black h-[50px] text-white flex items-center justify-between p-5'>
            {/* Navbar content */}
            <div className='font-bold'>ProdName</div>
        </nav>
    );
};

export default AppNavbar;
