const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    content: {
        type: String,
        required: true
    }
});

const users_roomsSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    rooms: [roomSchema]  
});

const users_rooms = mongoose.model('Users_rooms', users_roomsSchema);

module.exports = users_rooms;
