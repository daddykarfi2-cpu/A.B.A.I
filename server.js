require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(express.json({ limit: "10mb" }));
app.use(express.static(__dirname));

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY || ""
);

app.get("/api/status", (req, res) => {
  res.json({
    company: "ABUBAKAR AI TECHNOLOGY COMPANY",
    platform: "ABUBAKAR AI PLATFORM",
    status: "Server is running"
  });
});

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        error: "Please enter a message."
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({
        error: "AI connection is not configured yet."
      });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash"
    });

    const result = await model.generateContent(message);
    const response = await result.response;

    res.json({
      reply: response.text()
    });

  } catch (error) {
    console.error("AI Error:", error.message);

    res.status(500).json({
      error: "AI service is temporarily unavailable."
    });
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`ABUBAKAR AI is running on port ${PORT}`);
});
