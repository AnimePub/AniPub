const express = require("express");
const Notify = express.Router();

Notify.get("/Notify/", (req, res) => {
    const query = req.query.active;
    if (query === "false" || query === "pending") {
        const Msge = ["A Link Have been sent to your email account", "Please Verify it within 30min"]
        res.render("Notify", {
            Msge
        })
    } else if (query === "true") {
        const Msge = ["The Account is Already Active!"]
        res.render("Notify", {
            Msge
        })
    } else {
        res.redirect("/Home")
    }
})

module.exports = Notify;