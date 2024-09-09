import cors from "@elysiajs/cors";
import { Elysia } from "elysia";
import { home } from "~/routes/home";
import db from "./libs/db";

const corsUrl =
  process.env.NODE_ENV === "production"
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
  .listen(3011);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
