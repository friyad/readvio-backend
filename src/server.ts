import http from "http";
import { app } from "./app.js";
import { env } from "./config/env.js";
import { connectToDatabase } from "./config/db.js";

async function bootstrap(): Promise<void> {
  await connectToDatabase();

  const server = http.createServer(app);
  server.listen(env.PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server listening on http://localhost:${env.PORT}`);
  });
}

bootstrap().catch((error) => {
  // eslint-disable-next-line no-console
  console.error("Fatal startup error:", error);
  process.exit(1);
});
