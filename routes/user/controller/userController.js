const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/User');
const { validationResult } = require('express-validator');
require('dotenv').config()
const Playlist = require('../model/Playlist')
const Song = require('../model/Song')



async function signup(req, res){
    
    const errors = validationResult(req)
    try {
        const { username, email, password } = req.body;
        if (!errors.isEmpty()) {
            return res.status(500).json({ errors: errors.array() });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(500).json({ message: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
        const jwt_token = jwt.sign({ id: newUser._id, username: newUser.username, email: newUser.email }, process.env.JWT_KEY, { expiresIn: '24h' });
        res.cookie('music-app-cookie', jwt_token)
        res.json(newUser);
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

async function login(req, res){
    try {
        const { password, username } = req.body;

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(500).json({ message: 'Invalid username' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(500).json({ message: 'Invalid password' });
        }

        
        const jwt_token = jwt.sign({ id: user._id, username: user.username, email: user.email }, process.env.JWT_KEY, { expiresIn: '24h' });
        res.cookie('music-app-cookie', jwt_token)
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function addPlaylist(req, res){
    const id = req.params.id;
    const { playlistName } = req.body;

    try {
        const user = await User.findById({_id: id});
        if (!user) {
            return res.status(500).json({ message: 'User not found' });
        }

        const newPlaylist = new Playlist({
            name: playlistName,
            createdBy: id 
        });
        await newPlaylist.save();

        user.playlists.push(newPlaylist._id); 
        await user.save();

        res.status(200).json({ message: 'Playlist added successfully', playlist: newPlaylist, user });
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
}

async function addFavorite(req, res){
    const userId = req.params.userId;
    const { songId, title, artist, uri, imageURL } = req.body;

    try {
    
        const user = await User.findById({_id: userId});
        if (!user) {
            return res.status(500).json({ message: 'User not found' });
        }

    

        let song = await Song.findOne({songId});
        if (!song) {
            song = new Song({
                songId,
                title,
                artist,
                uri,
                imageURL


            })
            await song.save()
        }

        if (user.favorites.includes(song._id)) {
            return res.status(500).json({ message: 'Song is already in favorites' });
        }

        user.favorites.push(song._id); 
        await user.save();

        res.status(200).json({ message: 'Song added to favorites successfully', song });
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

async function getUserInfo(req, res){
    const userId = req.params.userId;

    try {
        const user = await User.findById({_id: userId})
            .populate({
                path: 'playlists',
                populate: {
                    path: 'songs',
                    model: 'Song'
                }
            })
            .populate({
                path: 'favorites',
                model: 
                'Song'
            });

        if (!user) {
            return res.status(500).json({ message: 'User not found' });
        }

        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
}

async function addSongToPlaylist(req, res){
    const playlistId = req.params.playlistId;
    const songId = req.params.songId;
    const {title, artist, uri, imageURL} = req.body

    try {
        const playlist = await Playlist.findById({_id: playlistId});
        if (!playlist) {
            return res.status(500).json({ message: 'Playlist not found' });
        }

        let song = await Song.findOne({songId});
        if (!song) {
            song = new Song({
                songId,
                title,
                artist,
                uri,
                imageURL
            })
            await song.save()
        }

        if (playlist.songs.includes(song._id)) {
            return res.status(500).json({ message: 'Song is already in the playlist' });
        }

        playlist.songs.push(song._id);
        await playlist.save();

        res.status(200).json({ message: 'Song added to playlist successfully' , playlist, song});
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

async function removeSongFromPlaylist(req, res){
    const playlistId = req.params.playlistId;
    const id = req.params.id;

    try {
        
        const playlist = await Playlist.findById(playlistId);
        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found' });
        }

        
        playlist.songs.pull({_id: id});
        await playlist.save();

        res.status(200).json({ message: 'Song removed from playlist successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}

async function removeSongFromFavorites(req, res){
    const userId = req.params.userId;
    const id = req.params.id;

    try {
        
        const user = await User.findById({_id: userId});
        if (!user) {
            return res.status(500).json({ message: 'User not found' });
        }
        const song = await Song.findOne({_id: id})
        let foundFavorite = user.favorites.includes(song._id)
        if (!foundFavorite) {
            return res.status(500).json({ message: 'Song is not in favorites' });
        }

        const result = await User.updateOne({_id: userId}, {$pull: {favorites: id}})

        res.status(200).json({ message: 'Song removed from favorites successfully', result, song });
    } catch (error) {
        res.status(500).json({error: error.message });
    }
}

async function removePlaylist(req, res){
    try {
        const {userId, playlistId} = req.params
        const updatedUser = await User.findOneAndUpdate({_id: userId}, {$pull: {playlists: playlistId}})
        res.status(200).json(updatedUser)
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}


module.exports = {signup, login, addPlaylist, addFavorite, getUserInfo, removeSongFromFavorites, addSongToPlaylist, removeSongFromPlaylist, removePlaylist}