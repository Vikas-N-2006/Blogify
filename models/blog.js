const { Schema, model, mongoose } = require('mongoose');

const blogSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    coverImageURL: {
        type: String,
        required: false
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
    }
},

    { timestamps: true }
);

const Blog = model('blog', blogSchema);

module.exports = Blog;