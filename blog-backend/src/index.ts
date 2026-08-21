import "dotenv/config";
import express from "express";
import userRouter from "./routes/userRouter";
import articleRouter from "./routes/articleRouter";
import cors from "cors";

const app = express();
const port = 3000;

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.send("berjalan di vercel");
});

app.use("/users", userRouter);
app.use("/articles", articleRouter);

if (process.env.NODE_ENV !== 'production'){
  app.listen(port, () => {
    console.log(`server is running on port ${port}`);
  });
}

export default app