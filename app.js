const express = require('express');
const cors = require('cors');
const { JsonDB, Config } = require('node-json-db');
const CryptoJS = require('crypto-js');

const PORT = 6969

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

const secretKey = "siski_pipiski"

const start = async () => {
    const db = new JsonDB(new Config("db", true, false, '/'));

    await db.reload();

    app.get("/api/crypt/:text", async (req, res, next) => {
        return res.json(CryptoJS.AES.encrypt(req.params.text, secretKey).toString());
    })

    app.post("/api/login", async (req, res, next) => {
        const {body} = req

        if(body.name) {
            try {
                const user = await db.getData("/"+body.name)

                return res.json({success: true, data: user})
            } catch(error) {
                await db.push("/"+body.name, {
                    ...body,
                    plugin: "Yandex",
                    balance: {
                        Google: 0,
                        Yandex: 0,
                    },
                    mails: 0,
                });

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