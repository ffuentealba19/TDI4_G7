import { run } from "@/libs/mongodb"
import {NextResponse} from "next/server"
import Usuario from "@/models/users"
    


export async function GET(){
    await run()
    
    const users = Usuario.find()
    return NextResponse.json(users)
}
export async function POST(request: any) {
    await run()
    const data = await request.json()
    const users = Usuario.create(data)
    return NextResponse.json(users)
    
}