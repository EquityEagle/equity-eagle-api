import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import { ConnectDB } from "./utils/ConnectDb.js";
import AuthRoute from "./routes/Auth.js";
import UserRoute from "./routes/User.js";
import TradeRoute from "./routes/Trade.js";
import SetupRoute from "./routes/Setup.js";
import TrackRoute from "./routes/AccountMetrix.js";
import CommunityRoute from "./routes/Community.js";
import NoteRoute from "./routes/Notification.js";
import ChatRoute from "./routes/Chat.js";
import MessageRoute from "./routes/Message.js";

const app = express();

dotenv.config();
app.use(express.json({ limit: "80mb" }));
app.use(cors());
app.use(bodyParser.json({ limit: "80mb" }));
app.use(bodyParser.urlencoded({ limit: "80mb", extended: true }));

// Routes
app.use("/auth", AuthRoute);
app.use("/trade", TradeRoute);
app.use("/user", UserRoute);
app.use("/setup", SetupRoute);
app.use("/metrix", TrackRoute);
app.use("/community", CommunityRoute);
app.use("/notification", NoteRoute);
app.use("/chat", ChatRoute);
app.use("/message", MessageRoute);

app.use("/", async (req, res) => {
  res.send("Home");
  console.log("Home");
});

const port = process.env.PORT || 5000;

app.listen(port, () =>
  console.log(`Server running on port http://localhost:${port} 🔥`)
);

ConnectDB();
