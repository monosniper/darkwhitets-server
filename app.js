const express = require('express');
const cors = require('cors');
const { JsonDB, Config } = require('node-json-db');

const PORT = 6969

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

const start = async () => {
    const db = new JsonDB(new Config("db", true, false, '/'));

    await db.reload();

    app.post("/api/login", async (req, res, next) => {
        const {body} = req

        if(body.name) {
            try {
                const user = await db.getData("/"+body.name)

                return res.json({success: true, data: user})
            } catch(error) {
                await db.push("/"+body.name, body);

                return res.json({success: true, data: body})
            }
        }

        return res.json({success: false})
    })

    app.post("/api/update", async (req, res, next) => {
        const {body} = req

        if(body.name) {
            try {
                const user = await db.push("/"+body.name, body, false)

                return res.json({success: true, data: user})
            } catch(error) {
                return res.json({success: false})
            }
        }

        return res.json({success: false})
    })

    await app.listen(PORT, () => {
        console.log('Server started at port ' + PORT);
    })
}

start();

module.exports = app;