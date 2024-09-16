import { run } from "@/libs/mongodb"
import {NextResponse} from "next/server"
import usuarios from "@/models/users";
    
export async function POST(request) {

    const data = await request.json();
    try {
        await run();
        console.log("si se pudo1")
        await usuarios.create(data);
        console.log("si se pudo2")
        return NextResponse.json({message : "nuevo usuario creado"});
    } 
    catch (error) {
        console.error("Error al crear el usuario:", error);
        return NextResponse.json({ error: "Error al crear el usuario" }, { status: 500 });
    }
}