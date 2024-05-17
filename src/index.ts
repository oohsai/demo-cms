import express from "express";
import bodyParser from "body-parser";
import router from "./routes";
import prisma from "./prismaClient";

const app = express();
app.use(bodyParser.json());
app.use("/", router);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit();
});
