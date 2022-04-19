const Query = require('../models/query');

exports.getQueries = (req, res, next) => {
    Query.find().then(queries => {
        res.status(200).json({message: 'Queries fetched successfully', queries: queries})
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
    });
};

exports.createQuery = (req, res, next) => {
    const username = req.body.username;
    const email = req.body.email;
    const message = req.body.message;

    const query = new Query({
        username: username,
        email:email,
        message: message
    });

    query.save().then(result => {
        res.status(201).json({message: 'message sent!!', query: result})
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
    });
};

exports.deleteQuery = (req, res, next) => {
    const queryId = req.params.queryId

    Query.findByIdAndRemove(queryId).then(result => {
        res.status(200).json({message: 'message deleted'})
    }).catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
    });
};
