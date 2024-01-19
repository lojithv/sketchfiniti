import React from 'react';

const Navbar: React.FC = () => {
    return (
        <nav className='bg-black h-[50px] text-white flex items-center p-5'>
            {/* Navbar content */}
            <div className='font-bold'>Plannr</div>
        </nav>
    );
};

export default Navbar;
