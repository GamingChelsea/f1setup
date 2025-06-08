import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: any, res: any) {
    try{
        const geminiKey = process.env.GeminiKey;
        if (!geminiKey) {
            throw new Error("GeminiKey environment variable is not set.");
        }
        const genAI = new GoogleGenerativeAI(geminiKey)
        
        const model = genAI.getGenerativeModel({model: "gemini-2.0-flash"})

        const data = await req.json()

        const prompt = data.body

        const result = await model.generateContent(prompt)
        const respone = await result.response;
        const output = await respone.text()

        return NextResponse.json({output: output})
    }catch(error){
        console.log(error)
    }
}