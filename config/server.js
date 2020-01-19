const { handleError } = require('./error')

module.exports = app => {

    app.use((err, req, res, next) => {
        handleError(err, res);
    });
    
    app.listen(process.env.PORT || 3001, process.env.HOST || 'localhost', () => {
        console.log(`Places API on ${process.env.HOST || 'localhost'}:${process.env.PORT || 3001 }`)
    });


}