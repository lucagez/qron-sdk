import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      for (let i = 0; i < 10; i++) {
        const data = encoder.encode(JSON.stringify({ time: Date.now() }) + '\n');
        await new Promise((resolve) => setTimeout(resolve, 1000));
        controller.enqueue(data);
      }
      controller.close();
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'application/stream+json'
    }
  })
}