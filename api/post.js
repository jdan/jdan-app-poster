module.exports = (req, res) => {
    res.json({
        success: true,
        key: req.body.key,
        text: req.body.text,
    })
}