const asyncHandler = require("../middlewares/asyncHandler.middleware");
const Comment = require("../models/comments.model");

const inserComment = asyncHandler(async (req, res) => {
  const data = req.body;
  const comment = await Comment.create({ blogId: data?.blogId, ...data });

  return res
    .status(201)
    .json({ message: "Comment created successfully", comment });
});

const getComment = asyncHandler(async (req, res) => {
  const { id } = req.params || {};

  const blog = await Comment.findById({ _id: id });

  return res
    .status(201)
    .json({ message: "Comment fetched successfully", data: blog });
});

module.exports = {
  inserComment,
  getComment,
};
