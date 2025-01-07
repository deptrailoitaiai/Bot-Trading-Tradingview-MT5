const { account1Service } = require('./account1Service');

const router = require('express').Router();

router.post('/', async (req, res) => {
    const { signal } = req.body;
    await account1Service(signal);
    return res.status(200).json({ message: 'Done' });
})

module.exports = router;