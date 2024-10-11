"use client";
import { useState } from 'react';


export const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <header className="bg-sky-500 text-white dark:bg-sky-550 lg:text-left">
        <div className="flex items-center justify-between border-b-2 border-sky-200 p-2 dark:border-sky-400">
            <div className="flex items-center space-x-4 text-3xl font-extrabold">
                <img src="/Logo_UCT.webp" alt="Avatar" className="w-20 rounded-full" />
                <p>PARKING CHECK</p>
            </div>
            {}
            <div className="relative menu-container">
                <button 
                    className="menu-button p-3 rounded-full hover:bg-blue-700" 
                    onClick={() => {
                        console.log("Menu button clicked");
                        toggleMenu();
                    }}
                >
                    &#9776; {}
                </button>
                {showMenu && (
                    <div className="menu-dropdown">
                        <a href="/Perfil" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Mi Perfil</a>
                        <a href="/report" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Reporte</a>
                    </div>
                )}
            </div>
        </div>
    </header>
  );
};
