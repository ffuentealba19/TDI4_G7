import { run } from "@/libs/mongodb"
import {NextResponse} from "next/server"
import Usuario from "@/models/users"
    
export async function POST(request) {
    await run()
    const data = await request.json()
    const users =  Usuario.create(data)
    return NextResponse.json(users)
    
}
