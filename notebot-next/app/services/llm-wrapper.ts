// import fetch from "node-fetch";

export const validIntents = {
  BookFlight: ["origin", "destination", "date"],
  SetAlarm: ["time", "date", "repeat"],
  OrderFood: ["restaurant", "foodItem", "quantity", "deliveryTime"],
  CheckWeather: ["location"],
  SendEmail: ["recipient", "subject", "body"],
  ScheduleMeeting: [
    "date",
    "time",
    "participants",
    "meeting agenda",
    "meeting detail",
    "description",
    "location",
    "meetingType",
  ],
  PlayMusic: ["song", "artist"],
};

const SYSTEM_PROMPT = `You are an intelligent assistant that extracts user intent and relevant parameters from natural language input.  
Always return responses in **valid JSON format** with these fields:  

{
  "intent": "detected_intent",
  "parameters": {
    "key": "value"
  },
  "confidence": confidence_score
}  

### **Rules:**
- **DO NOT** explain anything.  
- **DO NOT** include extra text.  
- **DO NOT** say "I can't do that" – just extract intent.  
- Always return a valid JSON object. 

### Example Formats:  
- **ScheduleMeeting:** Date, time, participants, location, meeting type, duration  
- **OrderFood:** Restaurant, food items (name & quantity), delivery time  
- **SendEmail:** Recipient, subject, body  
- **SetAlarm:** Time, label  
- **BookFlight:** Departure, destination, date, class  
- **CheckWeather:** Location, date  

Ensure the "intent" field remains **consistent** in PascalCase. (e.g., OneOf(${Object.keys(
  validIntents
).join(", ")}), etc.), and parameter extraction adapts to the user's request.  
`;

const DetailedPrompt = (
  userInput: string
) => `### Task: Extract Intent and Parameters from User Message
You are an AI that identifies the user's intent and extracts structured parameters. You must return a **valid JSON response**, Do not include any explanations or extra formatting. following this format:

{
  "intent": "OneOf(${Object.keys(validIntents).join(", ")})",
  "parameters": {
    "param1": "value1",
    "param2": "value2"
  },
  "confidence": confidence_score
}

### Examples:
====  
User: "Book a flight from New York to Los Angeles on April 10"  
Response: {"intent": "BookFlight", "parameters": {"origin": "New York", "destination": "Los Angeles", "date": "April 10"}, "confidence": 0.98}  
====  
User: "Set an alarm for 7 AM"  
Response: {"intent": "SetAlarm", "parameters": {"time": "7 AM"}, "confidence": 1.0}  
====  
User: "What's the weather like in Paris?"  
Response: {"intent": "CheckWeather", "parameters": {"location": "Paris"}, "confidence": 0.95}  
====  
User: "I want to order 2 cheeseburgers and 1 fries from McDonald's"  
Response: {"intent": "OrderFood", "parameters": {"restaurant": "McDonald's", "foodItems": [{"name": "cheeseburger", "quantity": 2}, {"name": "fries", "quantity": 1}]}, "confidence": 0.98}  
====  
User: "Get me a large Margherita pizza and 3 garlic breads from Domino's at 7 PM"  
Response: {"intent": "OrderFood", "parameters": {"restaurant": "Domino's", "foodItems": [{"name": "Margherita pizza", "quantity": 1}, {"name": "garlic bread", "quantity": 3}], "deliveryTime": "7 PM"}, "confidence": 0.96}  
====  
User: "Order 5 sushi rolls and 2 bowls of ramen from Sushi House for dinner"  
Response: {"intent": "OrderFood", "parameters": {"restaurant": "Sushi House", "foodItems": [{"name": "sushi rolls", "quantity": 5}, {"name": "ramen", "quantity": 2}], "deliveryTime": "dinner"}, "confidence": 0.95}  
==== 
User: "Send an email to John about the project update"  
Response: {"intent": "SendEmail", "parameters": {"recipient": "John", "subject": "Project update"}, "confidence": 0.98}  
====  
User: "Email Alice regarding the upcoming meeting"  
Response: {"intent": "SendEmail", "parameters": {"recipient": "Alice", "subject": "Upcoming meeting"}, "confidence": 0.96}  
====  
User: "Draft an email to Mark with the subject 'Invoice Details' and let him know the invoice has been sent"  
Response: {"intent": "SendEmail", "parameters": {"recipient": "Mark", "subject": "Invoice Details", "body": "The invoice has been sent"}, "confidence": 0.95}  
====  
User: "Schedule a meeting with John and Alice on March 15 at 3 PM in the conference room"  
Response: {"intent": "ScheduleMeeting", "parameters": {"date": "2025-03-15", "time": "3:00 PM", "participants": ["John", "Alice"], "location": "conference room", "meetingType": "in-person"}, "confidence": 0.98}  
====  
User: "Book a Zoom call with Mike at 10 AM tomorrow for 30 minutes"  
Response: {"intent": "ScheduleMeeting", "parameters": {"date": "2025-03-31", "time": "10:00 AM", "participants": ["Mike"], "location": "Zoom", "meetingType": "online", "duration": "30"}, "confidence": 0.96}  
====  
User: "Set up a Google Meet with the marketing team on April 5 at 2 PM"  
Response: {"intent": "ScheduleMeeting", "parameters": {"date": "2025-04-05", "time": "2:00 PM", "participants": ["marketing team"], "location": "Google Meet", "meetingType": "online"}, "confidence": 0.95}  
====

### Now process the following message:
User: "${userInput}"  
Response: `;


const SYSTEM_PROMPT2 = `
You are an AI assistant that processes and extracts structured information from user requests.  
Your task is to identify the user's intent and extract parameters if applicable.

Always return a **valid JSON response** with the following format:
{
  "intent": "detected_intent",
  "parameters": { "key": "value" },
  "confidence": confidence_score
}

If you cannot determine an intent, return an intent of "Unknown" and set confidence to 0.

Examples:
- User: "Schedule a Google Meet with David tomorrow at 3 PM."
  Response: 
  {
    "intent": "ScheduleMeeting",
    "parameters": {
      "date": "2025-04-01",
      "time": "3:00 PM",
      "participants": ["David"],
      "location": "Google Meet"
    },
    "confidence": 0.97
  }

- User: "Set an alarm for 7 AM."
  Response:
  {
    "intent": "SetAlarm",
    "parameters": {
      "time": "7:00 AM"
    },
    "confidence": 0.98
  }
`;



export async function processIntent(userInput: string) {
  const response = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "gemma:2b",
      prompt: DetailedPrompt(userInput),
      // messages: [
      //   { role: "system", content: SYSTEM_PROMPT2 },
      //   { role: "user", content: userInput },
      // ],
      max_tokens: 150,
      stream: false,
    }),
  });

  console.log(
    "-------------------------------------------------------------------------------------------"
  );

  if (!response.ok) {
    throw new Error(`API responded with status ${response.status}`);
  }

  const data = await response.json();
  console.log("Raw Response:", data);

  // Check if response is empty
  if (!data.response) {
    console.error("Error: Received empty response from Gemma");
    return {
      intent: "Error",
      parameters: {},
      confidence: 0.0,
      message:
        "No response received. Please check the input or model configuration.",
    };
  }

  // Clean up JSON formatting issues
  const cleanedResponse = data.response.replace(/```json|```/g, "").trim();

  console.log("Cleaned Response:", cleanedResponse);

  try {
    const parsedResponse = handleResponseWithIntent(cleanedResponse);
    return parsedResponse;
  } catch (error) {
    console.error("Failed to parse JSON:", cleanedResponse);
    throw new Error("Invalid JSON format from LLM");
  }
}

function handleResponseWithIntent(cleanedResponse: string) {
  try {
    const parsedResponse = JSON.parse(cleanedResponse);

    // Normalize intent name
    parsedResponse.intent = getClosestIntent(
      parsedResponse.intent,
      Object.keys(validIntents)
    );

    // Ensure all required parameters are extracted
    // parsedResponse.parameters = validateParameters(parsedResponse.intent, parsedResponse.parameters, validIntents);

    return parsedResponse;
  } catch (error) {
    console.error("Error handling response with Intent:", error);
  }
  return cleanedResponse;
}

// Function to normalize intent name
function getClosestIntent(intent: string, validIntents: string[]): string {
  const normalizedIntent = intent.replace(/[^a-zA-Z]/g, "").toLowerCase();
  return (
    validIntents.find((i) => i.toLowerCase() === normalizedIntent) ||
    "UnknownIntent"
  );
}

// Function to validate and fill missing parameters
function validateParameters(
  intent: string,
  parameters: any,
  validIntents: Record<string, string[]>
): any {
  const expectedParams = validIntents[intent] || [];
  const normalizedParams: any = {};

  expectedParams.forEach((param) => {
    normalizedParams[param] = parameters?.[param] || "Unknown"; // Fill missing params
  });

  return normalizedParams;
}

export async function setSystemInstruction() {
  const response = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "gemma:2b",
      messages: [
        { role: "system", content: DetailedPrompt },
        // { role: "system", content: SYSTEM_PROMPT },
        // { role: "user", content: userInput }
      ],
      stream: false,
    }),
  });

  const data = await response.json();
  return data.response;
}

// Test with a sample input
// detectIntentAndParams("Schedule a meeting with John and Alice at 3 PM on Monday").then(console.log);

// -----------------------------------------------------------------------------------------------------

// const validIntents = [
//   "BookFlight",
//   "SetAlarm",
//   "OrderFood",
//   "CheckWeather",
//   "SendEmail",
//   "ScheduleMeeting",
//   "PlayMusic"
// ];

// // Function to call Gemma LLM
// async function callGemma(prompt: string): Promise<string> {
//   const response = await fetch("http://localhost:11434/api/generate", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({
//       model: "gemma:2b",
//       prompt,
//       max_tokens: 150,
//       stream: false,
//     }),
//   });

//   const data = await response.text();
//   return data;
// }

// // Define Intent Handlers
// const intentHandlers: { [key: string]: Function } = {
//   SetAlarm: (time: string) => `Alarm set for ${time}.`,
//   SendEmail: (recipient: string, subject: string) =>
//     `Email sent to ${recipient} with subject: ${subject}.`,
//   BookFlight: (parameters) => {
//     console.log("parameters:", parameters);
//     return `Flight booked to ...`;
//   },
// };

// // Function to recognize intent
// async function processIntent(userQuery: string): Promise<string> {
//   //   const _prompt = `
//   //   Classify the intent of the following message into one of these intents:
//   //   - set_alarm
//   //   - send_email
//   //   - unknown

//   //   Message: "${userQuery}"
//   //   Response (JSON):
//   //   `;

//   const prompt = `Extract the intent and parameters from the following user message. Return a valid JSON object only, without any extra text. Make sure the intent matches exactly one from the list: ${validIntents.join(", ")}. User message: "${userQuery}". Response format example: {"intent": "OneOf(${validIntents.join(", ")}", "parameters":{"param1", "value1"}, "confidence": confidence_score}. Do not include any explanations or extra formatting.`;

//   const response = await callGemma(prompt);

//   try {
//     const result = JSON.parse(response);

//     console.log("Raw Result:", result);

//     const cleanedResponse = result.response.replace(/```json|```/g, "").trim();

//     const output = JSON.parse(cleanedResponse);

//     const closestIntent = getClosestIntent(output.intent, validIntents);

//     console.log("Parsed Result:", output, ', closestIntent: ', closestIntent);

//     if (intentHandlers[output.intent]) {
//       return intentHandlers[output.intent](...(result.parameters || []));
//     }
//   } catch (e) {
//     console.error("Error parsing response:", e);
//   }

//   return "Sorry, I couldn't understand the request.";
// }

// function getClosestIntent(intent: string, validIntents: string[]): string {
//   const normalizedIntent = intent.replace(/[^a-zA-Z]/g, "").toLowerCase();
//   return (
//     validIntents.find(i => i.toLowerCase() === normalizedIntent) || "UnknownIntent"
//   );
// }

// // Example Usage
// // processIntent("Set an alarm for 6 AM").then(console.log);
// // processIntent("Send an email to john@example.com with subject Meeting").then(console.log);

// export default processIntent;
