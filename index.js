import express from "express";
import { exec } from "child_process";
import fs from "fs";

const app = express();
app.use(express.json());

app.post("/render", (req, res) => {
  const { clips } = req.body;

  if (!clips || !clips.length) {
    return res.status(400).send("No clips");
  }

  fs.writeFileSync(
    "inputs.txt",
    clips.map(c => `file '${c}'`).join("\n")
  );

  exec(
    "ffmpeg -y -f concat -safe 0 -i inputs.txt -c copy output.mp4",
    (err) => {
      if (err) return res.status(500).send("Render failed");
      res.json({ status: "done" });
    }
  );
});

app.listen(3000, () => console.log("Render worker running"));
