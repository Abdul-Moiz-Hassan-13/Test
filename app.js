require('dotenv').config({ path: '../config/.env' });
const express = require ('express');
const connectDB = require('../config/db');
const mongoose = require('mongoose');
const Event = require('./Event');

const app = express();
const port = 3001;

app.use(express.json());

connectDB();

app.get('/', (req, res) => {
    res.send('MongoDB Connection Successful');
});

app.post('/create', async (req, res) => {
    try {
        const event = new Event(req.body);
        await event.save();
        res.status(201).json(event);
    } catch (error) {
        console.error("Error creating event:", error);
        res.status(500).json({ message: "Error creating event", error: error.message });
    }
});

app.get('/view', async (req, res) => {
    try {
        const { sortBy } = req.query;

        let sortOption = {}; 
        if (sortBy === 'date') {
            sortOption.date = 1;
        } 
        
        else if (sortBy === 'category') {
            sortOption.category = 1;
        }

        const events = await Event.find().sort(sortOption); 
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

app.post('/signup', async (req, res) => {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return res.status(400).json({ message: 'Username already taken' });
    }

    const newUser = new User({ username, password });
    await newUser.save();

    res.status(201).json({ message: 'Signup successful' });
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user || user.password !== password) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({ message: 'Login successful' });
});

app.post('/events', async (req, res) => {
    const { username, password, eventName } = req.body;

    const user = await User.findOne({ username });
    if (!user || user.password !== password) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const event = await Event.findOne({ name: eventName });
    if (!event) {
        return res.status(404).json({ message: 'Event not found' });
    }

    if (!user.events.includes(event._id)) {
        user.events.push(event._id);
        await user.save();
        return res.status(200).json({ message: 'Event added successfully', user });
    }

    res.status(400).json({ message: 'Event already added' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})

module.exports = app;