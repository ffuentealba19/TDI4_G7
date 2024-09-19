import { run } from "@/libs/mongodb"
import {NextResponse} from "next/server"


export async function POST(email : string, password : string){
    try{
        const client = await run()
        const db = client.db("ParkingCheckIntegra")
        const collection = db.collection("usuarios")
    
    
        const LoginRequest = await collection.find({UserEmail : email, UserPass : password}).toArray();

        console.log("Esta la lista la consulta ", LoginRequest)
        return LoginRequest
    }catch (error){
        console.log("fallo la consulta")
        throw error
    }   

}


