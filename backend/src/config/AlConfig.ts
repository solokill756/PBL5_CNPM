import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const apiKey = process.env.OPENAI_API_KEY;


// Kiểm tra xem API key có tồn tại không
const client = new OpenAI({
    apiKey,
});

export { client };
