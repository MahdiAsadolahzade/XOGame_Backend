const express = require("express");
const cors = require("cors");
const pool = require("./database");
const { Pool } = require('pg');
const app = express();



app.use(express.json());
app.use(cors());

app.get("/getuser", (req, res) => {
    const getUserQuery = "SELECT * FROM acounts";
    
    pool.query(getUserQuery)
      .then((result) => {
        res.json(result.rows); 
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: "خطای سرور" });
      });
  });


app.get("/checkuser/:username", (req, res) => {
    const username = req.params.username;
    const checkUserQuery = "SELECT * FROM acounts WHERE username = $1";
    
    pool.query(checkUserQuery, [username])
      .then((result) => {
        if (result.rows.length > 0) {
          res.json({ exists: true });
        } else {
          res.json({ exists: false });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: "خطای سرور" });
      });
  });
  
  
  app.post("/login", (req, res) => {
    const username = req.body["username"];
    const password = req.body["password"];
    const getUserQuery = "SELECT * FROM acounts WHERE username = $1";
  
    pool.query(getUserQuery, [username]) // پارامتر username را به صورت آرایه ارسال کنید
      .then((result) => {
        if (result.rows.length === 1) {
          const user = result.rows[0];
          if (user.password === password) {
            // رمز عبور مطابقت داشته است
            res.json({ message: "ورود موفقیت‌آمیز بود" });
          } else {
            // رمز عبور نامعتبر است
            res.status(401).json({ error: "رمز عبور نامعتبر است" });
          }
        } else {
          // کاربر با نام کاربری مشخص وجود ندارد
          res.status(404).json({ error: "کاربر با این نام کاربری وجود ندارد" });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: "خطای سرور" });
      });
  });
  


app.post("/adduser", (req, res) => {
  const username = req.body["username"];
  const password = req.body["password"];

  console.log("username:" + username, "password:" + password);
  const insertSTMT = `INSERT INTO acounts (username,password) VALUES ('${username}','${password}');`;
  pool.query(insertSTMT).then((response)=> {
    console.log(response);
  })
  .catch((err)=>{
    console.log(err);
  })
  console.log(req.body);
  res.send("Response Recived:" + req.body);
});

app.listen(4000, () => {
  console.log("server listening on : 4000");
});
