import { PineconeClient } from "@pinecone-database/pinecone";

if (!process.env.PINECONE_ENVIRONMENT || !process.env.PINECONE_API_KEY) {
  throw new Error("Pinecone environment or api key vars missing");
}

async function initPinecone() {
  try {
    const pinecone = new PineconeClient();
    await pinecone.init({
      environment: process.env.PINECONE_ENVIRONMENT ?? "",
      apiKey: process.env.PINECONE_API_KEY ?? "",
    });
    return pinecone;
  } catch (error) {
    console.error(error);
    throw new Error("Pinecone initialization failed");
  }
}

export const pinecone = await initPinecone();
