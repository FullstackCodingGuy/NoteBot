import { NextRequest } from "next/server";
import { processIntent, setSystemInstruction, validIntents } from "@/app/services/llm-wrapper";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const query = searchParams.get("q");
  // const prompt = "Set an alarm for 6 AM";
  //   const prompt = "your question is not clear, please rephrase it";
  const res = await processIntent(query);
  //   console.log("res: ", res);

  //   const res = await detectIntentAndParams(
  //     "Book a flight from New York to Los Angeles on April 10"
  //   );

  return new Response(JSON.stringify(res), {
    status: 200,
  });
}

/**
 * Initialize the model with the system instruction to train it and set the rules & context for the conversation.
 * @param req 
 * @returns 
 */

export async function POST(req) {
  
  await setSystemInstruction();

  console.log('initialization is done.')
  
  return Response.json({ message: "Initialization Done." });
}
