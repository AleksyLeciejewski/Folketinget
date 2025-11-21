module.exports = (req, res, next) => {
    res.status(404).json({ error: 'Site not found',
    requestedUrl : req.originalUrl });
}

