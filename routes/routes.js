const express = require("express");
const router = express();
const templatepath = require("app-root-path").resolve("/template/views");
const { requiresAuth } = require("express-openid-connect");
const mysql = require("mysql");

// views engine
router.set("views", templatepath);

//db mysql
const db_config = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
};
let db = mysql.createConnection(db_config);
db.connect((err) => {
  if (!err) {
    console.log("connection established with Database");
  } else {
    console.log("failed to connect to Databse", err);
  }
});
const handleDisconnect = () => {
  setInterval(function () {
    db.query("SELECT 1");
    console.log("handle connected");
  }, 60000);
};
handleDisconnect();

// routes
router.get("/", async (req, res) => {
  if (req.oidc.isAuthenticated()) {
    return res.redirect("/todos");
  }
  const q = `SELECT todotitle,todo from todos WHERE public = 1 ORDER BY todoid DESC`;
  const query = await db.query(q, (err, result) => {
    if (err) {
      return res.statusCode(500).send({
        message: "Internal server error",
      });
    }
    return res.render("index", { result });
  });
});
router.get("/todos", requiresAuth(), async (req, res) => {
  let user = await req.oidc.user.sub;
  let q = `SELECT todoid,todotitle,todo,public FROM todos WHERE ?`;
  let userq = [
    {
      userid: user,
    },
  ];
  const query = await db.query(q, userq, (err, result) => {
    res.render("todos", { result });
  });
});
router.post("/todos", async (req, res) => {
  console.log(req.body);
  const { todo, todotitle, public } = req.body;
  console.log(public);
  let user = req.oidc.user.sub;
  let q = `INSERT INTO todos SET ?`;
  let userq = [
    {
      todotitle: todotitle,
      todo: todo,
      userid: user,
      public: 0,
    },
  ];
  if (public === "") {
    userq = [
      {
        todotitle: todotitle,
        todo: todo,
        userid: user,
        public: 1,
      },
    ];
  }
  const query = await db.query(q, userq, (err, result) => {
    if (err) throw err;
    else {
      res.redirect("/todos");
    }
  });
});
router.post("/todos/update", async (req, res) => {
  let user = req.oidc.user.sub;
  const { todo, todotitle, public } = req.body;

  const todoid = parseInt(req.body.todoid);
  let q = `UPDATE todos SET ? WHERE ? AND ?`;
  let userq = [
    {
      todo: todo,
      todotitle: todotitle,
      public: 0,
    },
    {
      userid: user,
    },
    {
      todoid: todoid,
    },
  ];
  if (public === "") {
    userq = [
      {
        todo: todo,
        todotitle: todotitle,
        public: 1,
      },
      {
        userid: user,
      },
      {
        todoid: todoid,
      },
    ];
  }
  const query = await db.query(q, userq, (err, result) => {
    if (err) throw err;
    else {
      res.redirect("/todos");
    }
  });
});
router.post("/todos/delete", requiresAuth(), async (req, res) => {
  let user = req.oidc.user.sub;
  const todoid = parseInt(req.body.todoid);
  const q = `DELETE FROM todos WHERE ? AND ?`;
  const userq = [
    {
      userid: user,
    },
    {
      todoid: todoid,
    },
  ];
  const query = await db.query(q, userq, (err, result) => {
    if (err) throw err;
    else {
      res.redirect("/todos");
    }
  });
});
router.get("/public", async (req, res) => {
  const q = `SELECT todotitle,todo from todos WHERE public = 1 ORDER BY todoid DESC`;
  const query = await db.query(q, (err, result) => {
    if (err) {
      return res.statusCode(500).send({
        message: "Internal server error",
      });
    }
    return res.status(200).send(result);
  });
});
module.exports = router;
