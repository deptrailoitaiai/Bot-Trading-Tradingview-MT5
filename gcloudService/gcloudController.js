const bodyParser = require('body-parser');
const router = require('express').Router();
const { handlerSignal} = require('./gcloudService');

router.post("/", async (req, res) => {

    const data = Buffer.from(req.body.message.data, 'base64').toString();
    res.status(200).send('Received');
    console.log("-----------------------------------------------");
    console.log(data)
    await handlerSignal();
})

module.exports = router;