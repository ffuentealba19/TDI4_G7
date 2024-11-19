"use client";
import { useState } from "react";

const handleAddCarr = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const placa = (form.elements.namedItem('Placa') as HTMLInputElement).value;
    const modelo = (form.elements.namedItem('Modelo') as HTMLInputElement).value;
    const urlCarFile = (form.elements.namedItem('urlCar') as HTMLInputElement).files?.[0];

    if (!urlCarFile) {
        alert("Por favor, sube una imagen de tu vehículo.");
        return;
    }

    
    const formData = new FormData();
    formData.append('Placa', placa);
    formData.append('Modelo', modelo);
    formData.append('file', urlCarFile); 

    try {
        const response = await fetch('/api/Add_Car', {
            method: 'POST',
            body: formData 
        });

        const contentType = response.headers.get("content-type");

        if (contentType && contentType.includes("application/json")) {
            const jsonResponse = await response.json();
            if (response.ok) {
                console.log("Vehículo añadido exitosamente");
                console.log(jsonResponse);
            } else {
                console.log("Error al añadir vehículo");
            }
        } else {
            const textResponse = await response.text();
            console.log("Respuesta no JSON recibida:", textResponse);
            console.log("La respuesta del servidor no es un JSON válido.");
        }
    } catch (error) {
        console.error("Error:", error);
        console.log("Hubo un problema al procesar su solicitud.");
    }
};

const AddCar = () => {
    return (
        <div className="main-car">
            <div className="main-addcar">
                <h1>Añada su Vehiculo</h1>
                <form onSubmit={handleAddCarr}>
                    <input
                        type="text"
                        name="Placa"
                        id="Placa"
                        placeholder="Ingrese la placa serial de su vehiculo"
                        required
                    />
                    <input
                        type="text"
                        name="Modelo"
                        id="Modelo"
                        placeholder="Ingrese el modelo de su vehiculo"
                        required
                    />
                    <input
                        type="file"
                        name="urlCar"
                        id="urlCar"
                        accept="image/*"
                        required
                    />
                    <button type="submit">Añadir Vehiculo</button>
                </form>
            </div>
        </div>
    );
};

export default AddCar;
