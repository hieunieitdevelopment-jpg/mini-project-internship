const express = require("express");
const app = express();
app.use(express.json());

const users = [
    {id: 1, username: "admin", password: "admin123", role: "admin", email: "admin@test.com"},
{id: 2, username: "hieu", password: "123456", role: "user", email: "hieu@test.com"},
]

// X Vulnerable — nối chuỗi vào SQL query
app.post("/vulnerable/login", (req, res) => {
    const {username, password} = req.body;
    const sql = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
    console.log("Query: ", sql);

    // nếu có ' OR '1'='1 thì bypass
    if (username.includes("' OR '1'='1")){
        return res.json({success: true, message: "Bypass!", user: users[0]});
    }

    // login bình thường 
    const user = users.find(u => u.username === username && u.password === password);
    user ? res.json({success: true, user}) : res.status(401).json({success: false})
    });

// Safe — dùng find (giả lập parameterized query)
app.post("/safe/login", (req, res) => {
    const {username, password} = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    user ? res.json({success: true, user}) : res.status(401).json({success: false})
    });

// Vulnerable — trả HTML trực tiếp từ input, không escape:
app.get("/vulnerable/search", (req, res) => {
    const {q} = req.query;
    res.send(`<h1> kết quả: ${q}</h1>`)
});

// Safe — escape ký tự HTML:
app.get("/safe/search", (req, res) => {
    const {q} = req.query;
    const escaped = q.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    res.send(`<h1> kết quả: ${escaped}</h1>`)
});

// Lấy userId từ query param
app.get("/vulnerable/profile", (req, res ) => {
    const userId = parseInt(req.query.userId); // User có thể sửa!
    const user = users.find(u => u.id === userId);
    res.json({user});
});

// lấy userid từ token
app.get("/safe/profile", (req, res) => {
    const userId = 2;
    const user = users.find(u => u.id === userId);
    const { password, ...safeUser } = user;
    res.json({ user: safeUser});
});

// message khác nhau
app.post("/vulnerable/forgot-password", (req, res) => {
    const user  = users.find(u => u.email === req.body.email);
    if(user) {
        res.json({message: " đã gửi link reset"});
    } else {
        res.status(404).json({message: "Email không tồn tại"});
    }
});

// Safe — cùng message:
app.post("/safe/forgot-password", (req, res) => {
    res.json({message: " nếu email tồn tại, chúng tôi đã gửi link"});
});

app.listen(4000, () => console.log(" demo server chạy ở port 4000"))

