const mongoose = require('mongoose');

const FavoriteSongSchema = new mongoose.Schema({
    song: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Song',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model('Favorite', FavoriteSongSchema);

