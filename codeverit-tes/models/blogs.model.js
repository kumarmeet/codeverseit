const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const BlogSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    title: {
      type: String,
      require: true,
      trim: true,
    },
    content: {
      type: String,
      require: true,
      trim: true,
    },
    tags: [
      {
        type: String,
        require: true,
        trim: true,
      },
    ],
    status: {
      type: String,
      require: true,
      enum: ["published", "draft"],
      default: "draft",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Blog", BlogSchema);
