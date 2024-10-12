'use client';
import { useState } from "react";
import { Navbar } from "../components/Navbar";
import '../../styles/style1.css';

export default function Upload() {
    return (
        <div>
            <Navbar/>
            <div className="main">
                <div className="container">
                    <h1 className="title">MI PERFIL</h1>
                    <img src="" alt="" />
                    <button className="w-[90%] font-bold p-3 text-lg mt-5 border-0 rounded-full cursor-pointer bg-slate-200 text-black flex justify-between items-center">
                        Usuario estándar
                        <span className="text-sky-500">Mejorar subscripción!</span>
                    </button>
                    <button className="w-[90%] font-bold p-3 text-lg mt-5 border-0 rounded-full cursor-pointer bg-slate-200 text-black">
                        Editar Perfil
                        </button>
                    <button className="w-[90%] font-bold p-3 text-lg mt-5 border-0 rounded-full cursor-pointer bg-red-400 text-black">
                        Cerrar sesión
                        </button>
                </div>
            </div>
        </div>
            
    );
}
