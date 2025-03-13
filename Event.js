const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true,
    },

});
const Event = mongoose.model('Event', eventSchema);

module.exports = Event;