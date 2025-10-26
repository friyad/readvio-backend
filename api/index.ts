import { app } from "../src/app.js";
import { connectToDatabase } from "../src/config/db.js";

await connectToDatabase();

export default app;
