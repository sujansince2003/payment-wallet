import { env } from "./config/env.js";
import { connectDB } from "./db/index.js";
import app from "./app.js";

connectDB()
  .then(() => {
    app.listen(env.PORT, () => {
      console.log(`server is running on port ${env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("connection failed", error.message);
  });

app.get("/", (req, res) => {
  res.send("hello world");
});
