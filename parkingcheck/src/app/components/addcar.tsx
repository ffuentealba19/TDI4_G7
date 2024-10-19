"use client";
import { useState } from "react";

const AddCar = () => {
    return (
        <div className="main-car" >
            <div className="main-addcar">
                <h1>Añada su Vehiculo</h1>
                <form action="">
                    <input type="text" name="Placa" id="Placa" placeholder="Ingrese la placa serial de su vehiculo" required/>
                    <input type="text" name="Modelo" id="Modelo" placeholder="Ingrese el modelo de su vehiculo" required/>
                    <input type="file" name="urlCar" id="urlCar" placeholder="Ingrese una imagen de su vehiculo" required/>
                    <button type="submit" >Añadir Vehiculo</button>
                </form>
            </div>
        </div>
    );
}

export default AddCar;