import ChromaDbContext from "@/app/storage/chromadb";
import { v4 as uuidv4 } from "uuid";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const query = searchParams.get("q");
  const metadata = searchParams.get("m");
  const _size = searchParams.get("s"); // default 3

  const size = _size ? parseInt(_size) : 3;


  if (!query?.length) {
    return Response.json({ message: "No query provided!" });
  }
  // if (!metadata?.length) {
  //   return Response.json({ message: "No metadata provided!" });
  // }

  const db = await ChromaDbContext.notebook();

  console.log("query: ", query, getMetadataFromString(metadata));


  const result = await db.queryDocuments(
    [query],
    size,
    getMetadataFromString(metadata), 
    // { type: "deployment" },
    null
  );

  console.log("result: ", result);

  const docs = result?.documents?.[0];
  const docIds = result?.ids?.[0];
  // const distances = result?.distances?.[0];

  // combine above variables to sinle json object
  const combined = docs.map((doc, index) => ({
    title: doc,
    id: docIds[index],
    // distance: distances[index],
  }));

  return Response.json(combined);
}

function getMetadataFromString(metadata: string | null) {
  if(!metadata) {
    return [];
  }
  return JSON.parse(metadata);
}

export async function POST(req) {
  const param = await req.json();
  const { docs } = param;

  console.log("docs:", docs);

  // // Validate the request body
  // if (!documents || !metadatas || !ids) {
  //   return res.status(400).json({ error: "Missing required fields: documents, metadatas, or ids" });
  // }

  const db = await ChromaDbContext.notebook();
  // await db.addDocuments(
  //   [title], // Documents
  //   [{ type: "deployment", content }], // Metadata as an array of objects
  //   [uuidv4().toString()] // IDs
  // );

  const ids: string[] = [];
  const documents: string[] = [];
  const metadatas: Note[] = [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  docs.map((doc: any) => {
    const { id, type, title, content, tags } = doc;

    ids.push(id || uuidv4().toString());
    documents.push(title);
    metadatas.push({
      type,
      content,
      tags,
    });
  });

  console.log('adding: ', documents, metadatas, ids);

  await db.addDocuments(
    documents,
    metadatas,
    ids,
  );

  return Response.json({ message: "Item added good!" });
}


interface Note {
  id?: string;
  type?: "kb" | "article" | "blog" | "note";
  title?: string;
  content?: string;
  author?: string;
  tags?: string[];
}