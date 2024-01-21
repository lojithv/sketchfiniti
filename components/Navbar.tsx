"use client"
import React from 'react';

type Props = {

}

const Navbar = ({ }: Props) => {

    return (
        <nav className='bg-black h-[50px] text-white flex items-center justify-between p-5'>
            {/* Navbar content */}
            <div className='font-bold'>Plannr</div>
        </nav>
    );
};

export default Navbar;
