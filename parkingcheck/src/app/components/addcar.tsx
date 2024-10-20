"use client"; 
import { useState } from "react";

const handleAddCarr = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); 


    const form = event.currentTarget;
    const placa = (form.elements.namedItem('Placa') as HTMLInputElement).value;
    const modelo = (form.elements.namedItem('Modelo') as HTMLInputElement).value;
    const urlCar = (form.elements.namedItem('urlCar') as HTMLInputElement).value;

    const carData = {
        Placa: placa,
        Modelo: modelo,
        urlCar: urlCar
    };

    try {
        const response = await fetch('/api/Add_Car', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', 
            },
            body: JSON.stringify(carData), 
        });

        const contentType = response.headers.get("content-type");
        
        
        if (contentType && contentType.includes("application/json")) {
            const jsonResponse = await response.json(); 
            if (response.ok) {
                alert("Vehículo añadido exitosamente");
                console.log(jsonResponse);
            } else {
                alert("Error al añadir vehículo");
            }
        } else {
            const textResponse = await response.text(); 
            console.log("Respuesta no JSON recibida:", textResponse);
            alert("La respuesta del servidor no es un JSON válido.");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Hubo un problema al procesar su solicitud.");
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
                        type="text"
                        name="urlCar"
                        id="urlCar"
                        placeholder="Ingrese una URL de la imagen de su vehiculo"
                        required
                    />
                    <button type="submit">Añadir Vehiculo</button>
                </form>
            </div>
        </div>
    );
};

export default AddCar;
