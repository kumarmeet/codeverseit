const express = require("express");
const passport = require("passport");
const blogRouter = express.Router();
require("../auth/index");

const { authMiddleware } = require("../middlewares/auth.middleware");

const { inserBlog, getBlog, updateBlog, deleteBlog, getBlogs } = require("../controller/blog.controller");

blogRouter.use(authMiddleware);

blogRouter.post("/", inserBlog);

blogRouter.get("/all", getBlogs);

blogRouter.get("/:id", getBlog);

blogRouter.patch("/", updateBlog);

blogRouter.delete("/:id", deleteBlog);


module.exports = blogRouter;
