const { Router } = require("express");
const User = require("../models/user");
const multer = require("multer");
const path = require("path");
const router = Router();
const Blog = require("../models/blog");
const { checkForAuth } = require("../middlewaress/authentication")

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve(`./public/uploads`))
    },
    filename: function (req, file, cb) {
        const filename = `${Date.now()}-${file.originalname}`
        cb(null, filename)
    }
})

const upload = multer({ storage: storage })

router.get('/add-blog', (req, res) => {
    return res.render("addblog", {
        user: req.user
    });
})

router.post("/",
    checkForAuth,
    upload.single('coverImage'), async (req, res) => {
        try {
            const { title, content } = req.body;
            const blog = await Blog.create({
                title,
                content,
                createdBy: req.user?._id,
                coverImageURL: `/uploads/${req.file.filename}`
            })
            console.log("Blog created:", blog);
            return res.redirect(`/blog/${blog._id}`);
        }
        catch {
            console.error("Error in blog creation:", err);
            res.status(500).send("Internal Server Error");
        }
    });

router.get("/:id", async (req, res) => {
    const blog = await Blog.findById(req.params.id).populate("createdBy");
    console.log("blog:", blog.createdBy);
    return res.render("blog", {
        user: req.user,
        blog
    })
})

module.exports = router;