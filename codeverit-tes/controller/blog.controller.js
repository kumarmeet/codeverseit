const asyncHandler = require("../middlewares/asyncHandler.middleware");
const Blog = require("../models/blogs.model");
const commentsModel = require("../models/comments.model");

const inserBlog = asyncHandler(async (req, res) => {
  const data = req.body;
  const { id: userId } = req.user;

  const blog = await Blog.create({ userId, ...data });

  return res.status(201).json({ message: "Blog created successfully", blog });
});

const updateBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.body;
  const data = req.body;

  const blog = await Blog.findByIdAndUpdate(blogId, data, { new: true });

  if (!blog) {
    return res.status(404).json({ message: "Blog not found" });
  }

  return res.status(200).json({ message: "Blog updated successfully", blog });
});

const deleteBlog = asyncHandler(async (req, res) => {
  const { id } = req.param;

  const blog = await Blog.findByIdAndDelete(id);

  if (!blog) {
    return res.status(404).json({ message: "Blog not found" });
  }

  await commentsModel.deleteMany({blogId: id});

  return res.status(200).json({ message: "Blog deleted successfully" });
});

const getBlog = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const blog = await Blog.findById(id);
  const comments = await commentsModel.find({ blogId: id });

  if (!blog) {
    return res.status(404).json({ message: "Blog not found" });
  }

  return res
    .status(200)
    .json({ message: "Blog fetched successfully", data: { blog, comments } });
});

const getBlogs = asyncHandler(async (req, res) => {
  const { page = 1, searchKey = "", limit = 10 } = req.query;

  const parsedLimit = parseInt(limit, 10);
  const parsedPage = parseInt(page, 10);
  const offset = (parsedPage - 1) * parsedLimit;

  const blogs = await Blog.find({
    $or: [
      { title: { $regex: searchKey, $options: "i" } },
      { content: { $regex: searchKey, $options: "i" } },
      { tags: { $in: [new RegExp(searchKey, "i")] } },
    ],
  })
    .skip(offset)
    .limit(parsedLimit);


  const blogsWithComments = await Promise.all(
    blogs.map(async (blog) => {
      const comments = await commentsModel.find({ blogId: blog._id });
      return {
        ...blog.toObject(),
        comments, 
      };
    })
  );

  return res
    .status(200)
    .json({ message: "Blogs fetched successfully", data: blogsWithComments });
});

module.exports = {
  inserBlog,
  updateBlog,
  deleteBlog,
  getBlog,
  getBlogs,
};
