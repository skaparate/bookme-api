const router = require('express').Router();

module.exports = _ => {
    router.route('/api/books/test')
    .get((req, res) => {
        console.debug('Books/Tests');
        return res.json({
            data: 'Ok'
        });
    });

    return router;
};