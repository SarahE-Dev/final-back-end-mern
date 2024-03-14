const mongoose = require('mongoose');

const SongSchema = new mongoose.Schema({
    songId: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    artist: {
        type: String,
        required: true
    },
    uri: {
        type: String,
        required: true
    },
    imageURL: {
        type: String, 
        required: true
    }
});

module.exports = mongoose.model('Song', SongSchema);

