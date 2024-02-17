const express = require('express');
const uuid = require('uuid');
require('dotenv').config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT;

app.get('/', (req, res) => {
  res.send('App Working Successfully test v24');
});

const users = require('./users');

console.log(users[0]);

app.get('/api/users', (req, res) => {
    res.json(users);
});

// GET user by ID
app.get('/api/users/:userId', (req, res) => {
    const userId = req.params.userId;
    const user = users.find(user => user.id === userId);
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ error: 'User not found' });
    }
});

// POST create new user
app.post('/api/users', (req, res) => {
    const { username, age, hobbies } = req.body;
    if (!username || !age || !hobbies) {
        res.status(400).json({ error: 'Username, Age and Hobbies are required' });
    } else {
        const newUser = {
            id: uuidv4(),
            username,
            age,
            hobbies: hobbies || []
        };
        users.push(newUser);
        res.status(201).json(newUser);
    }
});

// PUT update user by ID
app.put('/api/users/:userId', (req, res) => {
    const userId = req.params.userId;
    const { username, age, hobbies } = req.body;
    const userIndex = users.findIndex(user => user.id === userId);
    if (userIndex !== -1) {
        if (!username || !age) {
            res.status(400).json({ error: 'Username and age are required' });
        } else {
            users[userIndex] = {
                ...users[userIndex],
                username,
                age,
                hobbies: hobbies || []
            };
            res.json(users[userIndex]);
        }
    } else {
        res.status(404).json({ error: 'User not found' });
    }
});

// DELETE user by ID
app.delete('/api/users/:userId', (req, res) => {
    const userId = req.params.userId;
    const initialLength = users.length;
    users = users.filter(user => user.id !== userId);
    if (users.length < initialLength) {
        res.status(204).end();
    } else {
        res.status(404).json({ error: 'User not found' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, ()=> {
	console.log(`Server is successfully running on port ${PORT}`);
    console.log(``);
    console.log(``);

});