const { Router } = require("express");
const User = require("../models/user");
const router = Router();

router.get('/signin', (req, res) => {
    return res.render("signin");
});

router.get('/signup', (req, res) => {
    return res.render("signup");
});

router.post('/signup', async (req, res) => {
    const { fullName, email, password } = req.body;
    await User.create({
        fullName,
        email,
        password
    });
    return res.redirect('signin');
});

router.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    try {
        const token = await User.matchPassAndGenerateToken(email, password);
        return res.cookie("token", token).redirect("/");
    } catch (error) {
        console.error(error);
        return res.status(401).render("signin", { error: "Invalid email or password" });
    }
});

router.get('/logout', (req, res) => {
    res.clearCookie("token");
    return res.redirect("/user/signin");
});

module.exports = router;