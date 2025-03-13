const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../User');
const Event = require('../Event');

beforeAll(async () => {
    await mongoose.connect(process.env.TEST_DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('API Tests', () => {
    let testUser;
    let testEvent;

    beforeAll(async () => {
        await User.deleteMany({});
        await Event.deleteMany({});

        testUser = new User({ username: 'testuser', password: 'testpass' });
        await testUser.save();

        testEvent = new Event({ name: 'Sample Event', description: 'A test event', category: 'Tech', date: new Date(), time: '10:00 AM' });
        await testEvent.save();
    });

    test('GET / should return success message', async () => {
        const res = await request(app).get('/');
        expect(res.status).toBe(200);
        expect(res.text).toBe('MongoDB Connection Successful');
    });

    test('POST /signup should create a user', async () => {
        const res = await request(app).post('/signup').send({ username: 'newuser', password: 'newpass' });
        expect(res.status).toBe(201);
        expect(res.body.message).toBe('Signup successful');
    });

    test('POST /login should authenticate user', async () => {
        const res = await request(app).post('/login').send({ username: 'testuser', password: 'testpass' });
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Login successful');
    });

    test('GET /view should return events', async () => {
        const res = await request(app).get('/view');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    test('POST /create should create an event', async () => {
        const res = await request(app).post('/create').send({ name: 'Event 2', description: 'Second event', category: 'Sports', date: new Date(), time: '2:00 PM' });
        expect(res.status).toBe(201);
        expect(res.body.name).toBe('Event 2');
    });

    test('POST /events should add an event to user', async () => {
        const res = await request(app).post('/events').send({ username: 'testuser', password: 'testpass', eventName: 'Sample Event' });
        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Event added successfully');
    });
});
