import dotenv from "dotenv";
import { generateGeminiResponse } from "./services/gemini.services.js";

dotenv.config();

const test = async () => {
    try {
        const prompt = "Please respond with a simple valid JSON: { \"notes\": \"Hello world\" }";
        console.log("Calling Gemini API...");
        const result = await generateGeminiResponse(prompt);
        console.log("Success! Result:", result);
    } catch (err) {
        console.error("Test failed!", err.stack || err);
    }
};

test();
