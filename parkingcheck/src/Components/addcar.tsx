"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const AddCar = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const router = useRouter();

    const handleAddCar = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        // Crear un FormData con los datos del formulario
        const formData = new FormData(event.target as HTMLFormElement);

        // Verificar si los campos necesarios están presentes en el FormData
        if (
            !formData.has("Placa") ||
            !formData.has("Marca") ||
            !formData.has("Modelo") ||
            !formData.has("Color")
        ) {
            setError("Todos los campos del vehículo son obligatorios.");
            setLoading(false);
            return;
        }

        // Obtener el token desde el localStorage
        const token = localStorage.getItem("token");

        // Verificar si el token está presente
        if (!token) {
            setError("No se ha proporcionado un token de autenticación.");
            setLoading(false);
            return;
        }

        try {
            // Crear un objeto con los datos del vehículo (solo los campos de tipo string)
            const vehicleData = {
                Placa: formData.get("Placa"),
                Marca: formData.get("Marca"),
                Modelo: formData.get("Modelo"),
                Color: formData.get("Color")
            };

            // Enviar la información del vehículo
            const response = await fetch('http://localhost:4001/auth/addauto', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,  // Asegúrate de incluir el token aquí
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(vehicleData), // Convertir a JSON solo los datos de texto
            });

            if (!response.ok) {
                throw new Error('Error al añadir el vehículo');
            }

            const newVehicle = await response.json();
            setSuccessMessage('Vehículo añadido con éxito');
            router.push("/Vehiculos"); // Redirigir a la página de vehículos (ajustar según sea necesario)

        } catch (error) {
            setError(error.message || 'Ha ocurrido un error.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="main-car">
            <div className="main-addcar">
                <h1>Añadir Vehículo</h1>
                {loading && <p>Cargando...</p>}
                {error && <p className="text-red-500">{error}</p>}
                {successMessage && <p className="text-green-500">{successMessage}</p>}
                <form onSubmit={handleAddCar}>
                    <div>
                        <label htmlFor="Placa">Placa</label>
                        <input
                            type="text"
                            name="Placa"
                            id="Placa"
                            placeholder="Ingrese la placa del vehículo"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="Marca">Marca</label>
                        <input
                            type="text"
                            name="Marca"
                            id="Marca"
                            placeholder="Ingrese la marca del vehículo"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="Modelo">Modelo</label>
                        <input
                            type="text"
                            name="Modelo"
                            id="Modelo"
                            placeholder="Ingrese el modelo del vehículo"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="Color">Color</label>
                        <input
                            type="text"
                            name="Color"
                            id="Color"
                            placeholder="Ingrese el color del vehículo"
                            required
                        />
                    </div>
                    <div>
                        <button type="submit" disabled={loading}>
                            {loading ? "Añadiendo..." : "Añadir Vehículo"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddCar;
