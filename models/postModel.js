const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    user_name: {
      type: String,
    },
    user_photo: {
      type: String,
    },
    title: {
        type: String,
        trim: true,
        required: true
    },
    text: {
        type: String,
        trim: true,
        required: true
      },
    selectedFile: {
        type: String
      },
    comments: {
        type: Array,

      },
      likes: {
        type: Array
      },
      // likeCount: {
      //   type: Number,
      //   default: 0
      // },
    tags: {
      type: Array,
    },

},{timestamps: true})

module.exports = mongoose.model('Post', postSchema)