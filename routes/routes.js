const express = require("express")
const router = express()
const templatepath = require("app-root-path").resolve("/template/views")
const { requiresAuth } = require("express-openid-connect")
const mysql = require("mysql")

// views engine
router.set("views", templatepath)

//db mysql
const db_config = {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB,
}
let db = mysql.createConnection(db_config)
db.connect((err) => {
    if (!err) {
        console.log("connection established with Database")
    } else {
        console.log("failed to connect to Databse", err)
    }
})
const handleDisconnect = () => {
    setInterval(function () {
        db.query("SELECT 1")
        console.log("handle connected")
    }, 60000)
}
handleDisconnect()

// routes
router.get("/", (req, res) => {
    if (req.oidc.isAuthenticated()) {
        res.redirect("/todos")
    } else {
        res.redirect("/login")
        // res.send(req.oidc.isAuthenticated() ? "Logged in" : "Logged out")
    }
})
router.get("/todos", requiresAuth(), async (req, res) => {
    let user = await req.oidc.user.sub
    let q = `SELECT todoid,todotitle,todo FROM todos WHERE ?`
    let userq = [
        {
            userid: user,
        },
    ]
    const query = await db.query(q, userq, (err, result) => {
        res.render("todos", { result })
    })
})
router.post("/todos", async (req, res) => {
    const { todo, todotitle } = req.body
    let user = req.oidc.user.sub
    let q = `INSERT INTO todos SET ?`
    let userq = [
        {
            todotitle: todotitle,
            todo: todo,
            userid: user,
        },
    ]
    const query = await db.query(q, userq, (err, result) => {
        if (err) throw err
        else {
            res.redirect("/todos")
        }
    })
})
router.post("/todos/update", async (req, res) => {
    let user = req.oidc.user.sub
    const { todo, todotitle } = req.body
    const todoid = parseInt(req.body.todoid)
    let q = `UPDATE todos SET ? WHERE ? AND ?`
    let userq = [
        {
            todo: todo,
            todotitle: todotitle,
        },
        {
            userid: user,
        },
        {
            todoid: todoid,
        },
    ]
    const query = await db.query(q, userq, (err, result) => {
        if (err) throw err
        else {
            res.redirect("/todos")
        }
    })
})
router.post("/todos/delete", async (req, res) => {
    let user = req.oidc.user.sub
    const todoid = parseInt(req.body.todoid)
    const q = `DELETE FROM todos WHERE ? AND ?`
    const userq = [
        {
            userid: user,
        },
        {
            todoid: todoid,
        },
    ]
    const query = await db.query(q, userq, (err, result) => {
        if (err) throw err
        else {
            res.redirect("/todos")
        }
    })
})
router.get("/api/todos", async (req, res) => {
    let user = await req.oidc.user.sub
    let q = `SELECT todoid,todotitle,todo FROM todos WHERE ?`
    let userq = [
        {
            userid: user,
        },
    ]
    // let q = `SELECT * FROM todos`
    const query = await db.query(q, userq, (err, result) => {
        console.log(result)
        res.send(result)
    })
})
module.exports = router
