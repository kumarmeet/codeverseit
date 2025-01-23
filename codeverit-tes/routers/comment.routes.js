const express = require("express");
const commentRouter = express.Router();
require("../auth/index");

const { authMiddleware } = require("../middlewares/auth.middleware");
const { inserComment, getComment } = require("../controller/comment.controller");


commentRouter.use(authMiddleware);

commentRouter.post("/", inserComment);

commentRouter.get("/:id", getComment);

module.exports = commentRouter;
