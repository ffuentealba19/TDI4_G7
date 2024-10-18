import Parking from "@/models/parking";
import { run } from "@/libs/mongodb";
import { cookies } from "next/headers";

export async function GET() {
    await run()
    const All_park = Parking.find
    
}