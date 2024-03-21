const express = require('express');
const router = express.Router()
const {body} = require('express-validator')



const {signup, login, addPlaylist, addFavorite, getUserInfo, removeSongFromFavorites, addSongToPlaylist, removeSongFromPlaylist, removePlaylist, updateUserInfo} = require('../user/controller/userController')

router.post('/signup', [
    body('username', 'username cannot be empty').not().isEmpty(),
    body('username', 'username must be alphanumeric').isAlphanumeric(),
    body('email', 'email cannot be empty').not().isEmpty(),
    body('email', 'email entry must be valid email').isEmail(),
    body('password', 'password cannot be empty').not().isEmpty(),
    body('password', 'must be a strong password').isStrongPassword()
], signup)

router.post('/login', login)

router.post('/add-playlist/:id',addPlaylist )

router.post('/add-favorite/:userId', addFavorite)

router.get('/get-user-info/:userId', getUserInfo)

router.post('/delete-favorite/:userId/:id', removeSongFromFavorites)

router.post('/add-song-playlist/:playlistId/:songId', addSongToPlaylist)

router.post('/remove-playlist-song/:playlistId/:id', removeSongFromPlaylist)

router.post('/remove-playlist/:userId/:playlistId', removePlaylist)

router.post('/update-user-info/:id', updateUserInfo)

module.exports = router