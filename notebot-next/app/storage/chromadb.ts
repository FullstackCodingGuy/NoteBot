import { ChromaClient, Collection } from "chromadb";

class ChromaDb<T extends Record<string, any>> {
  private client: ChromaClient;
  private collectionName: string;
  private collection?: Collection;

  constructor(collectionName: string) {
    this.client = new ChromaClient();
    this.collectionName = collectionName;
  }

  async initializeCollection(): Promise<void> {
    this.collection = await this.client.getOrCreateCollection({
      name: this.collectionName,
    });
    // console.log('initializeion done: ', this.collection)
  }

  async addDocuments(
    documents: string[],
    metadatas: Record<string, any>[],
    ids: string[]
  ): Promise<void> {
    if (!this.collection) {
      throw new Error(
        "Collection is not initialized. Call initializeCollection first."
      );
    }
    console.log("adding document: ", documents);
    await this.collection.upsert({ documents, metadatas, ids });

    // await this.collection.upsert({
    //   documents: [
    //     "This is a document about pineapple",
    //     "This is a document about oranges",
    //   ],
    //   ids: ["id1", "id2"],
    // });
  }

  async queryDocuments(
    queryTexts: string[],
    nResults: number = 10,
    where: Record<string, any> | null = null,
    whereDocument: Record<string, any> | null = null
  ): Promise<any> {
    if (!this.collection) {
      throw new Error(
        "Collection is not initialized. Call initializeCollection first."
      );
    }

    // const results = await this.collection.query({
    //   queryTexts: "This is a query document about pineapple", // Chroma will embed this for you
    //   nResults: 2, // how many results to return
    // });
    // console.log('result: ', results)
    // return results;

    return await this.collection.query({
      queryTexts,
      nResults,
      where,
      whereDocument,
    });
  }

  async updateDocuments(
    ids: string[],
    documents: T[],
    metadatas: Record<string, any>[]
  ): Promise<void> {
    if (!this.collection) {
      throw new Error(
        "Collection is not initialized. Call initializeCollection first."
      );
    }
    await this.collection.delete({ ids });
    await this.addDocuments(documents, metadatas, ids);
  }

  async deleteDocuments(ids: string[]): Promise<void> {
    if (!this.collection) {
      throw new Error(
        "Collection is not initialized. Call initializeCollection first."
      );
    }
    await this.collection.delete({ ids });
  }
}

interface Note {
  id: string;
  title: string;
  content: string;
  tags?: string[];
}

// const knowledgeDb = new ChromaDb<KnowledgeArticle>("knowledge_articles");

// (async () => {
//   await knowledgeDb.initializeCollection();
//   await knowledgeDb.addDocuments(
//     [
//       { title: "Next.js Guide", content: "Learn Next.js", tags: ["nextjs", "react"] },
//       { title: "ChromaDB Intro", content: "Using ChromaDB with Next.js", tags: ["database", "vector"] }
//     ],
//     [{ source: "guide" }, { source: "tutorial" }],
//     ["doc1", "doc2"]
//   );
// })();

const ChromaDbContext = () => {
  return {
    notebook: async () => {
      const db = new ChromaDb<Note>("knowledge_articles");
      await db.initializeCollection();
      return db;
    },
  };
};

export default ChromaDbContext();
