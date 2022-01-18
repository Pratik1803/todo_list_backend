const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const fs = require("fs");

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// for login
app.get("/log-in", (req, res) => {
    fs.readFile(`${__dirname}/database/userinfo/userinfo.json`, "utf-8", (err, data) => {
        const existingUsersData = JSON.parse(data).userinfo;
        const existingUsers = [];
        existingUsersData?.map((user) => {
            existingUsers.push(user);
        });
        res.send(existingUsers);
    });
})

// for signin
app.get("/sign-in", (req, res) => {
    fs.readFile(`${__dirname}/database/userinfo/userinfo.json`, "utf-8", (err, data) => {
        const existingUsersData = JSON.parse(data).userinfo;
        const existingUsers = [];
        existingUsersData?.map((user) => {
            existingUsers.push(user.username);
        });
        res.send(existingUsers);
    });
})

app.post("/sign-in", (req, res) => {
    fs.readFile(`${__dirname}/database/userinfo/userinfo.json`, "utf-8", (err, readData) => {
        const currentUsers = JSON.parse(readData).userinfo;
        const userPresent = currentUsers.filter(user => user.username === req.body.username);

        if (userPresent.length !== 0) {
            res.send("user already exists..")
        } else {
            fs.writeFile(`${__dirname}/database/userinfo/userinfo.json`, JSON.stringify({ userinfo: [...currentUsers, req.body] }), (err, data) => { });
            fs.readFile(`${__dirname}/database/userdata/userdata.json`, "utf-8", (err, userData) => {
                const presentUsers = JSON.parse(userData).userdata;
                fs.writeFile(`${__dirname}/database/userdata/userdata.json`, JSON.stringify({ userdata: [...presentUsers, { username: req.body.username, tasks: [] }] }), (err, data) => { });
            })

            res.send(req.body);
        };
    });
});


// for home page

app.get("/home", (req, res) => {
    fs.readFile(`${__dirname}/database/userdata/userdata.json`, "utf-8", (err, data) => {
        const userInfo = JSON.parse(data).userdata.filter(user => user.username === req.query.username)[0];
        res.send(userInfo);
    });
});

app.post("/home", (req, res) => {
    fs.readFile(`${__dirname}/database/userdata/userdata.json`, "utf-8", (err, data) => {
        const JSONdata = JSON.parse(data).userdata;
        let userInfo = JSONdata.filter(user => user.username === req.query.username)[0];
        let updatedUserData = { username: userInfo.username, tasks: [...userInfo.tasks, req.body.task] };
        fs.writeFile(`${__dirname}/database/userdata/userdata.json`, JSON.stringify({ userdata: [...JSONdata.filter(user => user.username !== req.query.username), updatedUserData] }), (err, data) => {
            res.send(data);
        });
        if (req.body.type === "add") {

        } else if (req.body.type === "del") {
            let updatedUserData = { username: userInfo.username, tasks: [...userInfo.tasks.filter(task => task !== req.body.task)] };
            fs.writeFile(`${__dirname}/database/userdata/userdata.json`, JSON.stringify({ userdata: [...JSONdata.filter(user => user.username !== req.query.username), updatedUserData] }), (err, data) => {
                res.send(data)
            });
        };
    });
});

app.delete("/home", (req, res) => {
    fs.readFile(`${__dirname}/database/userdata/userdata.json`, "utf-8", (err, data) => {
        const JSONdata = JSON.parse(data).userdata;
        let userInfo = JSONdata.filter(user => user.username === req.query.username)[0];
        let updatedUserData = { username: userInfo.username, tasks: [...userInfo.tasks.filter(task => task !== req.body.task)] };
        fs.writeFile(`${__dirname}/database/userdata/userdata.json`, JSON.stringify({ userdata: [...JSONdata.filter(user => user.username !== req.query.username), updatedUserData] }), (err, data) => {
            res.send(data)
        });
    });
});
app.listen(8000, () => {
    console.log("listening to port 8000...");
});
