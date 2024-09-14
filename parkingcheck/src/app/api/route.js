import { connDB } from "../../libs/route";
import User from '@/models/user'
import {NextResponse} from "next/server"
export async function GET(){
    await connDB()

    const users = User.find()
    return NextResponse.json(users)
}