const express = require("express");
const app = express();
const port = 3000;

const mysql = require("mysql2");
const bodyParser = require("body-parser");

app.set(port);

//MySQL 연결 설정
const con = mysql.createConnection({
    host: "localhost",
    port: "3306",
    user: "root",
    password: "qwer1234",
    database: "testdb",
});

//MySQL 연결
con.connect(function (err) {
    if (err) {
        console.error("Error connecting to MySQL database: " + err.stack);
        return;
    }
    console.log("Connected to MySQL database as id " + con.threadId);

    // 테이블 생성 쿼리 실행
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL
        )
      `;

    con.query(createTableQuery, (error) => {
        if (error) {
            console.error("Error creating users table: " + error.stack);
            return;
        }
        console.log("Users table created successfully");
    });
});

// body-parser 미들웨어 사용
app.use(bodyParser.json());

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/public/index.html");
});

// GET 요청 처리 - 모든 사용자 가져오기
app.get("/users", (req, res) => {
    con.query("SELECT * FROM users", (error, results) => {
        if (error) {
            console.error("Error executing MySQL query: " + error.stack);
            return res.status(500).send("Error executing MySQL query");
        }
        res.send(results);
    });
});

// POST 요청 처리 - 새로운 사용자 추가
app.post("/users", (req, res) => {
    const { name, email } = req.body;
    con.query(
        "INSERT INTO users (name, email) VALUES (?, ?)",
        [name, email],
        (error, results) => {
            if (error) {
                console.error("Error executing MySQL query: " + error.stack);
                return res.status(500).send("Error executing MySQL query");
            }
            res.send(results);
        }
    );
});

// PUT 요청 처리 - 사용자 정보 업데이트
app.put("/users/:id", (req, res) => {
    const { name, email } = req.body;
    const userId = req.params.id;
    con.query(
        "UPDATE users SET name = ?, email = ? WHERE id = ?",
        [name, email, userId],
        (error, results) => {
            if (error) {
                console.error("Error executing MySQL query: " + error.stack);
                return res.status(500).send("Error executing MySQL query");
            }
            res.send(results);
        }
    );
});

// DELETE 요청 처리 - 사용자 삭제
app.delete("/users/:id", (req, res) => {
    const userId = req.params.id;
    con.query("DELETE FROM users WHERE id = ?", [userId], (error, results) => {
        if (error) {
            console.error("Error executing MySQL query: " + error.stack);
            return res.status(500).send("Error executing MySQL query");
        }
        res.send(results);
    });
});

app.listen(port, () => console.log(`Example app listening on port ${port}`));
