import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { DBconnect } from "./config/db.connection.js";
import router from "./router/router.user.js";
import { transporter } from "./lib/nodemail.js";
import expenserouter from "./router/expense.router.js";
import dns from "dns";
dotenv.config();
dns.setDefaultResultOrder("ipv4first");
const app = express();

const PORT = 5000;

DBconnect();

// Allow Authorization header from the frontend and enable credentials
app.use(
  cors({
    origin:"*",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods:"*"
  })
);
// Preflight handling is covered by the CORS middleware above
app.use(express.json());

app.use("/api", router);
app.use("/api/expense", expenserouter);


try {
  await transporter.verify();
  console.log("Server is ready to take our messages");
} catch (err) {
  console.error("Verification failed:", err);
}
app.get("/api",(req,res,next)=>{
    console.log( "=======>",process.env.secretkey)
    return res.json({name:"kabian",email:"kabilan@gmail.com"})
})
app.use("/uploads", express.static("uploads"));
app.listen(PORT, () => {
  console.log("server running on", PORT);
  console.log("------------------------>");
});