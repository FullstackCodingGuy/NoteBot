import ChromaDbContext from "@/app/storage/chromadb";
import { v4 as uuidv4 } from 'uuid';

export async function GET(req) {
  const db = await ChromaDbContext.notebook();
  const queryTexts = ["article"];

  const res = await db.queryDocuments(
    queryTexts,
    10,
    { type: "deployment" },
    null
  );
  return Response.json({ message: "Hello from App Router API!", res });
}

export async function POST(req) {
  const param = await req.json();
  const { title, content } = param;

  console.log('title: ', title, ', content:', content)

  // // Validate the request body
  // if (!documents || !metadatas || !ids) {
  //   return res.status(400).json({ error: "Missing required fields: documents, metadatas, or ids" });
  // }

  const db = await ChromaDbContext.notebook();
  await db.addDocuments(
    [title], // Documents
    [{ type: "deployment", content }], // Metadata as an array of objects
    [uuidv4().toString()] // IDs
  );
  return Response.json({ message: "Item added good!" });
}
