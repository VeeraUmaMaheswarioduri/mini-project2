const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const server = http.createServer(app);
const io = new Server(server);
app.use(bodyParser.json());
app.use(express.static("Backend"));
mongoose.connect("mongodb://localhost:27017/pollApp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const optionSchema = new mongoose.Schema({
  text: String,
  votes: { type: Number, default: 0 },
});
const pollSchema = new mongoose.Schema({
  question: String,
  options: [optionSchema],
});
const Poll = mongoose.model("Poll", pollSchema);
app.post("/vote", async (req, res) => {
  const { pollId, optionId } = req.body;
  const poll = await Poll.findById(pollId);
  if (!poll) return res.status(404).send("Poll not found");

  const option = poll.options.id(optionId);
  if (!option) return res.status(404).send("Option not found");

  option.votes += 1;
  await poll.save();

  io.emit("voteUpdate", poll); 
  res.json({ success: true, poll });
});
server.listen(3000, () => console.log("Server running on http://localhost:3000"));
