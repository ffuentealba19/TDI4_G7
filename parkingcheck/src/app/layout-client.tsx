'use client'; 
import React, { useState } from 'react';
import Image from 'next/image';
import '../styles/style1.css';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => setShowMenu(!showMenu);

  return (
    <>
      <header className="bg-[#5785A4] text-white dark:bg-[#5785A4] lg:text-left">
        <div className="flex items-center justify-between border-b-2 border-[#5785A4] p-2 dark:border-[#5785A4]">
          <div className="flex items-center space-x-4 text-3xl font-extrabold">
            <img src="/Logo_UCT.webp" alt="Avatar" className="w-20 rounded-full" />
            <p>PARKING CHECK</p>
          </div>
          <div className="relative menu-container">
            <button 
              className="menu-button p-3 rounded-full hover:bg-blue-700" 
              onClick={() => {
                console.log("Menu button clicked");
                toggleMenu();
              }}
            >
              &#9776;
            </button>
            {showMenu && (
              <div className="menu-dropdown">
                <a href="/Perfil" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Mi Perfil</a>
                <a href="/reservar" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Reservar Estacionamiento</a>
                <a href="/report" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Reporte</a>
              </div>
            )}
          </div>
        </div>
      </header>

      {}
      <div className="login-page">
        <main className="main">
          <div className="logo-container">
            <Image 
              src="/Logo_UCT.webp"
              alt="Logo UCT"
              width={700}
              height={700}
              className="logo-image"
              style={{ opacity: 0.5 }}
            />
          </div>
          {}
          {children}
        </main>
      </div>
      
      <footer className="footer">
        <p>© 2024 Todos los derechos reservados.</p>
      </footer>
    </>
  );
}
