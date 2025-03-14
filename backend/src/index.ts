import cors from "@elysiajs/cors";
import { Elysia } from "elysia";
// import { compression } from 'elysia-compress';
import { bookies } from "~/routes/bookies";
import { home } from "~/routes/home";

export const compression = new Elysia({ name: 'compressResponses' })
  .mapResponse(({ request, response, set }) => {
    const isJson = typeof response === 'object'
    const compressionRequested = request.headers.get('Accept-Encoding')?.includes('gzip')

    const text = isJson ? JSON.stringify(response) : (response?.toString() ?? '')

    // Only compress if content is larger than 2KB and compression is requested
    if (!compressionRequested || text.length < 2048) {
      return response as Response
    }

    set.headers['Content-Encoding'] = 'gzip'

    return new Response(Bun.gzipSync(new TextEncoder().encode(text)), {
      headers: {
        'Content-Type': `${isJson ? 'application/json' : 'text/plain'}; charset=utf-8`,
      },
    })
  })
  .as('plugin')

const corsUrl =
  Bun.env.NODE_ENV === "production"
    ? /^(?:https?:\/\/)?(?:\w+\.)?sacsbrainz\.com$/
    : /localhost/;

const app = new Elysia()
  .use(
    cors({
      origin: corsUrl,
      credentials: true,
      allowedHeaders: ["Content-Type"],
    })
  )
  .use(compression) //switched to this because orignal compression lib is broken
  // .use(
  //   compression({
  //     as: 'scoped',
  //   }),
  // )
  // analytics
  // .onAfterResponse((res) => {
  //   const createObj = {
  //     data: JSON.stringify(res),
  //     responseTime: performance.now()
  //   };
  //   try {
  //     db.query(
  //       `INSERT INTO analytics 
  //     (data, response_time) 
  //     VALUES ($data, $responseTime)`
  //     )
  //       .get(createObj as unknown as Record<string, string>);

  //   } catch (error) {
  //     console.log(error)
  //   }
  // })
  .use(home)
  .use(bookies)
  .listen(3011);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
