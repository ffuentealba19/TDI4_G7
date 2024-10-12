<<<<<<< HEAD
import ClientLayout from '../layout-client'; 
=======
'use client';
import { useState } from "react";
import { Navbar } from "../components/Navbar";
>>>>>>> 290c266a9d50090b60373c89e1d5e7ecec404073
import '../../styles/style1.css';

export default function Upload() {
    return (
        <div>
            <Navbar/>
            <div className="main">
                <div className="container">
                    <h1 className="title">MI PERFIL</h1>
<<<<<<< HEAD
                    <h2>Bienvenido, {}!</h2>
                    <button className="w-[90%] font-bold p-3 text-lg mt-5 border-0 rounded-full cursor-pointer bg-[#D9D9D9] text-black flex justify-between items-center">
=======
                    <img src="" alt="" />
                    <button className="w-[90%] font-bold p-3 text-lg mt-5 border-0 rounded-full cursor-pointer bg-slate-200 text-black flex justify-between items-center">
>>>>>>> 290c266a9d50090b60373c89e1d5e7ecec404073
                        Usuario estándar
                        <span className="text-[#008EBB]">Mejorar subscripción!</span>
                    </button>
                    <button className="w-[90%] font-bold p-3 text-lg mt-5 border-0 rounded-full cursor-pointer bg-[#D9D9D9] text-black">
                        Editar Perfil
                        </button>
                    <button className="w-[90%] font-bold p-3 text-lg mt-5 border-0 rounded-full cursor-pointer bg-[#5785A4] text-black">
                        <span className="text-[#D9D9D9]">Cerrar sesión</span>
                        </button>
                </div>
            </div>
        </div>
            
    );
}
