import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import { ConnectDB } from "./utils/ConnectDb.js";
import AuthRoute from "./routes/Auth.js";
import UserRoute from "./routes/User.js";
import TradeRoute from "./routes/Trade.js";

const app = express();

dotenv.config();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json({ limit: "80mb" }));
app.use(bodyParser.urlencoded({ limit: "80mb", extended: true }));

// Routes
app.use("/auth", AuthRoute);
app.use("/trade", TradeRoute);
app.use("/user", UserRoute);

app.use("/", async (req, res) => {
  res.send("Home");
  console.log("Home");
});

const port = process.env.PORT || 5000;

app.listen(port, () =>
  console.log(`Server running on port http://localhost:${port} 🔥`)
);

ConnectDB();
