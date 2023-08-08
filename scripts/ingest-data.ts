import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PINECONE_INDEX_NAME, PINECONE_NAME_SPACE } from "@/config/pinecone";
import { pinecone } from "@/utils/pinecone-client";
import { PineconeStore } from 'langchain/vectorstores/pinecone';

const filePath = "docs";

export const run = async () => {
  try {
    const directoryLoader = new DirectoryLoader(filePath, {
      ".pdf": (path) => new PDFLoader(path),
    });

    const rawDocs = await directoryLoader.load();

    const testSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const docs = await testSplitter.splitDocuments(rawDocs);
    console.log("spilt docs ", docs);
    console.log("creating vector store...");

    const embeddings = new OpenAIEmbeddings();
    const index = pinecone.Index(PINECONE_INDEX_NAME); //change to your own index name

    console.log(PINECONE_NAME_SPACE);
    console.log(PINECONE_INDEX_NAME);
    
    //embed the PDF documents
    await PineconeStore.fromDocuments(docs, embeddings, {
      pineconeIndex: index,
      namespace: PINECONE_NAME_SPACE,
      textKey: "text",
    });
  } catch (error) {}
};

(async () => {
  await run();
  console.log("ingestion complete");
})();
