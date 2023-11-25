import cors from "@elysiajs/cors";
import { Elysia} from "elysia";
import { home } from "~/routes/home";

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
  .use(home)
  .listen(3011);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
