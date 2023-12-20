const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
const cors = require("cors");
const Message = require("./Message.model");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB

const connectDB = async () => {
  mongoose
    .connect(
      "mongodb+srv://saad:saad@nyaydoot.ndqa1q9.mongodb.net/?retryWrites=true&w=majority"
    )
    .then(console.log("Connected To MongoDB"))
    .catch((err) => {
      console.error(err);
    });
};

connectDB();

app.post("/message", async (req, res) => {
  const { chatKey, message } = req.body;
  const msg = await Message.findOne({ chatKey: chatKey });
  if (msg) {
    msg.message = message;
    msg.save();
    return res.json("Message Updated"); 
  } else {
    const newMessage = new Message({
      chatKey,
      message,
    });
    newMessage
      .save()
      .then(() => res.json("Message Added"))
      .catch((err) => res.status(400).json("Error: " + err));
  }
});

app.get("/message/:chatKey", async (req, res) => {
  const { chatKey } = req.params;
  const msg = await Message.findOne({ chatKey: chatKey });
  if (msg) {
    return res.json(msg);
  } else {
    return res.json("No Message Found");
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
