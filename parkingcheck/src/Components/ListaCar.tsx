"use client";
import { useEffect, useState } from "react";

const Vehiculos = () => {
    const [vehiculos, setVehiculos] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchVehiculos = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    setError("No se ha proporcionado un token de autenticación.");
                    return;
                }

                const response = await fetch('http://localhost:4001/auth/getautos', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Error al obtener los vehículos');
                }

                const data = await response.json();
                if (Array.isArray(data)) {
                    setVehiculos(data);
                } else {
                    setVehiculos([]);
                    setError('Los datos no son válidos.');
                }
            } catch (err: any) {
                setError(err.message || 'Ha ocurrido un error al cargar los vehículos.');
            }
        };

        fetchVehiculos();
    }, []);

    const handleDeleteVehicle = async (vehiculoId: string) => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                setError("No se ha proporcionado un token de autenticación.");
                return;
            }

            // Corregir la URL, reemplazando :id por el vehiculoId
            const response = await fetch(`http://localhost:4001/auth/deleteauto/${vehiculoId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Error al eliminar el vehículo');
            }

            // Actualizar el estado para eliminar el vehículo de la lista
            setVehiculos((prevVehiculos) => prevVehiculos.filter(v => v._id !== vehiculoId));
        } catch (err: any) {
            setError(err.message || 'Ha ocurrido un error al eliminar el vehículo.');
        }
    };

    return (
        <div className="container mx-auto mt-8">
            <h1 className="text-2xl font-bold mb-4">Lista de Vehículos</h1>
            {error && <p className="text-red-500">{error}</p>}
            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr>
                        <th className="border border-gray-300 p-2">Placa</th>
                        <th className="border border-gray-300 p-2">Marca</th>
                        <th className="border border-gray-300 p-2">Modelo</th>
                        <th className="border border-gray-300 p-2">Color</th>
                        <th className="border border-gray-300 p-2">Imagen</th>
                        <th className="border border-gray-300 p-2">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {vehiculos.length > 0 ? (
                        vehiculos.map((vehiculo, index) => (
                            <tr key={index} className="text-center">
                                <td className="border border-gray-300 p-2">{vehiculo.Placa}</td>
                                <td className="border border-gray-300 p-2">{vehiculo.Marca}</td>
                                <td className="border border-gray-300 p-2">{vehiculo.Modelo}</td>
                                <td className="border border-gray-300 p-2">{vehiculo.Color}</td>
                                <td className="border border-gray-300 p-2">
                                    {vehiculo.Imagen ? (
                                        <img
                                            src={vehiculo.Imagen}
                                            alt={`Imagen de ${vehiculo.Marca} ${vehiculo.Modelo}`}
                                            className="w-20 h-20 object-cover mx-auto"
                                        />
                                    ) : (
                                        "Sin imagen"
                                    )}
                                </td>
                                <td className="border border-gray-300 p-2">
                                    <button
                                        onClick={() => handleDeleteVehicle(vehiculo._id)}
                                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={6} className="border border-gray-300 p-2 text-center">
                                No hay vehículos disponibles.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Vehiculos;
