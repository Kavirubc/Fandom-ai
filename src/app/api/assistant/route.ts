import { AssistantResponse } from 'ai';
import OpenAI from 'openai';

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  // Parse the request body
  const input: {
    threadId: string | null;
    message: string;
  } = await req.json();

  // Create a thread if needed
  const threadId = input.threadId ?? (await openai.beta.threads.create({})).id;

  // Add a message to the thread
  const createdMessage = await openai.beta.threads.messages.create(
    threadId,
    {
      role: 'user',
      content: input.message,
    },
    { signal: req.signal },
  );

  return AssistantResponse(
    { threadId, messageId: createdMessage.id },
    async ({ forwardStream }) => {
      // Run the assistant on the thread
      const runStream = openai.beta.threads.runs.stream(
        threadId,
        {
          assistant_id:
            process.env.ASSISTANT_ID ??
            (() => {
              throw new Error('ASSISTANT_ID is not set');
            })(),
        },
        { signal: req.signal },
      );

      // Forward run status would stream message deltas
      await forwardStream(runStream);
    },
  );
}
