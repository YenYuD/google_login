const router = require("express").Router();
const passport = require("passport");
const bcrypt = require("bcrypt");

const db = require(__dirname + "/../modules/mysql-connect");

router.get("/login", (req, res) => {
    res.render("login", { user: req.user });
});

router.post(
    "/login",
    passport.authenticate("local-login", {
        failureRedirect: "/auth/login",
        failureMessage: "wrong username or password",
    })
);

router.get("/signup", (req, res) => {
    res.render("signup", { user: req.user });
});

router.post("/signup", async (req, res) => {
    // const output = {
    //     success: false,
    //     error: "",
    //     code: 0,
    // };

    const sql01 = `SELECT * FROM memberdata WHERE  m_email = ? AND m_username = ?`;
    const [r1] = await db.query(sql01, [req.body.email, req.body.name]);

    if (r1.length) {
        output.code = 402;
        output.error = "使用者已經存在";

        return res.json(output);
    }

    if (!r1.length) {
        output.code = 200;
        output.error = "新會員註冊成功";
        output.success = true;

        const sql02 = `INSERT INTO memberdata(m_username, m_passwd,m_email,create_at) VALUES (? ,? ,?,NOW())`;

        let { name, email, password } = req.body;

        const hash = await bcrypt.hash(password, 10);
        password = hash;

        const [result] = await db.query(sql02, [name, email, password]);

        res.json(output);
    }
});

router.get(
    "/google",
    passport.authenticate("google", {
        scope: ["email", "profile"],
    })
);

router.get("/logout", (req, res, next) => {
    req.logOut();
    res.redirect("/");
});

router.get(
    "/google/redirect",
    passport.authenticate("google", { failureRedirect: "/login" }),
    (req, res) => {
        res.redirect("/profile");
    }
);

module.exports = router;
