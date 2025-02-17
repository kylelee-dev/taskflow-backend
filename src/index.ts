import express, { Request, Response } from 'express';

const app = express();
const port = 3000; // Or any port you prefer

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, World from Express and TypeScript!');
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});