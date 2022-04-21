const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const commentSchema = new Schema({
    username: {
        type: String,
        default: "Unknown"
    },

    comment: {
        type: String
    }
}, {timestamps: true});

module.exports = mongoose.model('Comment', commentSchema);