const { Schema, model, mongoose } = require('mongoose');

const commentSchema = new Schema({
    content: {
        type: String,
        required: true,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    blogId: {
        type: Schema.Types.ObjectId,
        ref: "Blog",
    }
},

    { timestamps: true }
);

const Comment = model('comment', commentSchema);

module.exports = Comment;