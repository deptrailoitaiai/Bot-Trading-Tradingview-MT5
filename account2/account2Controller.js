const { account2Service } = require('./account2Service');

const router = require('express').Router();

router.post('/', async (req, res) => {
    const { signal } = req.body;
    const { symbol } = req.body;
    await account2Service(signal,symbol);
    return res.status(200).json({ message: 'Done' });
})

module.exports = router;