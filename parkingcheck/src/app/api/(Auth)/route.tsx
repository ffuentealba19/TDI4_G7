import { run } from "@/libs/mongodb"
import {NextResponse} from "next/server"
    


export async function GET(){
    await run()
    
    const users = "conexion hecha"
    return NextResponse.json(users)
}
