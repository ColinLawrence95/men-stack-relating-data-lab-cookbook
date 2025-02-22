const express = require("express");
const router = express.Router();

const User = require("../models/user.js");

router.get("/", async function (req, res) {
    try {
        if (!req.session.user) {
            return res.redirect("/auth/sign-in");
        }

        const currentUser = await User.findById(req.session.user._id);

        res.locals.pantry = currentUser.pantry;

        res.render("foods/index.ejs");
    } catch (error) {
        console.log(error);
        res.redirect("/");
    }
});
router.get("/new", function (req, res) {
    res.render("foods/new.ejs");
});
router.get("/:itemId/edit", async function (req, res) {
    try {
        const currentUser = await User.findById(req.session.user._id);

        const item = currentUser.pantry.id(req.params.itemId);

        if (!item) {
            return res.redirect("/users");
        }

        res.locals.item = item;
        res.render("foods/edit.ejs");
    } catch (error) {
        console.log(error);
        res.redirect("/");
    }
});

router.post("/", async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id);

        currentUser.pantry.push({ name: req.body.name });

        await currentUser.save();

        res.redirect(`/users/${currentUser._id}/foods`);
    } catch (error) {
        console.log(error);
        res.redirect("/");
    }
});
router.put("/:itemId", async function (req, res) {
    const currentUser = await User.findById(req.session.user._id);
    const item = currentUser.pantry.id(req.params.itemId);
    item.set(req.body);
    await currentUser.save();
    res.redirect(`/users/${currentUser._id}/foods`);
});
router.delete("/:itemId", async function (req, res) {
    try {
        const currentUser = await User.findById(req.session.user._id);

        const item = currentUser.pantry.id(req.params.itemId);

        if (item) {
            item.deleteOne();
            await currentUser.save();
        }

        res.redirect(`/users/${currentUser._id}/foods`);
    } catch (error) {
        console.log(error);
        res.redirect("/");
    }
});

module.exports = router;
