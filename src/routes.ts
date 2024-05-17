import { Router } from "express";
import prisma from "./prismaClient";

const router = Router();

router.post("/create-entity", async (req, res) => {
  const { entityName, attributes } = req.body;

  try {
    let modelDefinition = `model ${entityName} {\n  id Int @id @default(autoincrement())\n`;
    attributes.forEach((attr: any) => {
      if (attr.type === "string") modelDefinition += `  ${attr.name} String\n`;
      if (attr.type === "number") modelDefinition += `  ${attr.name} Int\n`;
      if (attr.type === "date") modelDefinition += `  ${attr.name} DateTime\n`;
    });
    modelDefinition += "}";

    const schemaPath = "prisma/schema.prisma";
    const fs = require("fs");
    fs.appendFileSync(schemaPath, `\n${modelDefinition}\n`);

    await prisma.$disconnect();
    const { exec } = require("child_process");
    exec(
      `npx prisma migrate dev --name ${entityName} `,
      (error: any, stdout: any, stderr: any) => {
        if (error) {
          console.error(`exec error: ${error}`);
          res.status(500).json({ error: error.message });
          return;
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
        res
          .status(201)
          .json({ message: `Entity ${entityName} created successfully.` });
      }
    );
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.post("/:entityName", async (req, res) => {
  const { entityName } = req.params;
  const data = req.body;

  try {
    const createdRecord = await (prisma as any)[entityName].create({ data });
    res.status(201).json(createdRecord);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/:entityName", async (req, res) => {
  const { entityName } = req.params;

  try {
    const records = await (prisma as any)[entityName].findMany();
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.put("/:entityName/:id", async (req, res) => {
  const { entityName, id } = req.params;
  const data = req.body;

  try {
    const updatedRecord = await (prisma as any)[entityName].update({
      where: { id: Number(id) },
      data,
    });
    res.status(200).json(updatedRecord);
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.delete("/:entityName/:id", async (req, res) => {
  const { entityName, id } = req.params;

  try {
    await (prisma as any)[entityName].delete({
      where: { id: Number(id) },
    });
    res.status(200).json({ message: "Item deleted successfully." });
  } catch (error) {
    res.status(500).json({ error });
  }
});

export default router;
