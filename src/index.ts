import express, { Request, Response } from "express";
import authRoutes from "./routes/auth.routes";
import dotenv from "dotenv";
dotenv.config();
const app = express();
const port = 3000; // Or any port you prefer

app.use(express.json());
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World from Express and TypeScript!");
});

app.use("/api/auth", authRoutes);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

export default app;
