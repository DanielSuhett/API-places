const { handleError } = require('./error')

module.exports = app => {

    app.use((err, req, res, next) => {
        handleError(err, res);
    });
    
    app.listen(process.env.PORT || 3001, () => {
        console.log(`Places API on 'localhost':${process.env.PORT || 3001 }`)
    });
}