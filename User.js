const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    
    events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },

});
const User = mongoose.model('User', userSchema);

module.exports = User;