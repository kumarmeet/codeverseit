const express = require("express");
const compression = require("compression");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config({ path: ".env" });

const AuthRouter = require("./routers/user.routes");
const BlogRouter = require("./routers/blog.routes");
const CommentRouter = require("./routers/comment.routes");

const app = express();

const PORT = process.env.PORT || "4444";

app.use(compression());

app.use(cors());

app.use(express.json());

app.get("/test", (req, res) => {
  return res.json({ message: "working" });
});

app.use("/api/auth", AuthRouter);
app.use("/api/blogs", BlogRouter);
app.use("/api/comments", CommentRouter);

//server side error handle middleware
app.use((err, req, res, next) => {
    console.log(err);
  
    return res.status(500).json({
      errorMessage: err.message || "something went wrong!",
      errorLog: err.errors[0].message,
    });
  });

mongoose
  .connect(`${process.env.DB_URI}${process.env.DB_NAME}`)
  .then(() => {
    app.listen(PORT, () => {
      console.log("Running server on port " + PORT);
    });
  })
  .catch((error) => {
    console.log(error);
    console.log("Database not connected");
  });
