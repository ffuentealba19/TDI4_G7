"use client";  

import { Navbar } from "@/Components/Navbar";
import { useState } from 'react';
import { useRouter } from 'next/navigation';  

export default function ReportPage() {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/reportUser', {  
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titulo, descripcion, usuarioID: 'user123' }),
      });

      if (response.ok) {
        alert('Reporte enviado con éxito');
        router.push('/Home');
      } else {
        alert('Error al enviar el reporte');
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Crear Reporte</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold">Título</label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full p-2 border border-gray-300"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold">Descripción</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full p-2 border border-gray-300"
              required
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            Enviar Reporte
          </button>
        </form>
      </div>
    </div>
  );
}
