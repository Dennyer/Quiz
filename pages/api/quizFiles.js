import fs from "fs";
import path from "path";

export default function handler(req, res) {
  try {
    const quizDir = path.join(process.cwd(), "public", "quizJson");
    const files = fs
      .readdirSync(quizDir)
      .filter((file) => file.endsWith(".json"))
      .map((file) => ({
        [file.slice(0, -5)]: file.slice(0, -5).replace(/_/g, " "),
      }));

    res.status(200).json({ files });
  } catch (error) {
    res.status(500).json({ error: "Unable to read directory" });
  }
}
