const express = require("express");
const app = express();
const port = 3000;

const mysql = require("mysql2");
const ejs = require("ejs");

app.set("view engine", "ejs");

const con = mysql.createConnection({
    host: "localhost",
    port: "3306",
    user: "root",
    password: "qwer1234",
    database: "testdb",
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected");
});

app.get("/", (request, response) => {
    const sql = "select * from course";
    con.query(sql, function (err, result, fields) {
        if (err) throw err;
        response.render("index", { course: result });
    });
});

app.get("/delete/:ID", (req, res) => {
    const sql = "DELETE FROM course WHERE ID = ?";
    con.query(sql, [req.params.ID], function (err, result, fields) {
        if (err) throw err;
        console.log(result);
        res.redirect("/");
    });
});

app.post("/update/:ID", (req, res) => {
    const sql = "UPDATE course SET ? WHERE ID = " + req.params.ID;
    con.query(sql.req.body, function (err, result, fields) {
        if (err) throw err;
        console.log(result);
        res.redirect("/");
    });
});

app.get("/edit/:ID", (req, res) => {
    const sql = "SELECT * FROM course WHERE ID = ?";
    con.query(sql, [req.params.ID], function (err, result, fields) {
        if (err) throw err;
        res.render("edit", { course: result });
    });
});

app.listen(port, () => console.log(`Example app listening on port ${port}`));
