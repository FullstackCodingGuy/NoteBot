import ChromaDbContext from "@/app/storage/chromadb";
import data from "../../../data/kb_issues.json";

export async function GET() {
  const db = await ChromaDbContext.notebook();

  console.log('Syncing data...', data.length);
  const documents = data.map((item) => item.title);
  const metadatas = data.map((item) => ({
    type: item.type,
    title: item.title,
    content: item.content,
    category: item.category,
    tags: item.tags,
  }));
  const ids = data.map((item) => item.id);

  await db.addDocuments(documents, metadatas, ids);

  return Response.json("Done");
}
