import mongoose from 'mongoose'

export async function connDB(){
    await mongoose.connect("mongodb+srv://parker:Avocato1@parkingcheck.q8rss.mongodb.net/?retryWrites=true&w=majority&appName=ParkingCheck")
}