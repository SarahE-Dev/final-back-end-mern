const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    playlists: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Playlist'
    }],
    favorites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Song'
    }]
    
})

module.exports = mongoose.model('User', UserSchema)