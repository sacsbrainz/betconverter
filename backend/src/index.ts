import cors from "@elysiajs/cors";
import { Elysia } from "elysia";
import { compression } from 'elysia-compress';
import db from "~/libs/db";
import { bookies } from "~/routes/bookies";
import { home } from "~/routes/home";

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
  .use(
    compression({
      as: 'scoped',
    }),
  )
  // analytics
  .onAfterResponse((res) => {
    const createObj = {
      data: JSON.stringify(res),
      responseTime: performance.now()
    };
    try {
      db.query(
        `INSERT INTO analytics 
      (data, response_time) 
      VALUES ($data, $responseTime)`
      )
        .get(createObj as unknown as Record<string, string>);

    } catch (error) {
      console.log(error)
    }
  })
  .use(home)
  .use(bookies)
  .listen(3011);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
