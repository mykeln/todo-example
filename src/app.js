const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Import the database functions from database.js
const db = require('./database');

// Assuming db.updateTask is designed to update the completed status
function updateTask(id, completed, callback) {
    const sql = `UPDATE tasks SET completed = ? WHERE id = ?`;
    db.run(sql, [completed, id], function(err) {
        if (err) {
            callback(err);
        } else {
            callback(null, { id: this.lastID, completed });
        }
    });
}

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '..', 'public')));

// Endpoint to serve the main HTML file from the public directory
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// API Endpoint to get all tasks
app.get('/tasks', (req, res) => {
    db.getAllTasks((err, tasks) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(tasks);
        }
    });
});

// API Endpoint to add a new task
app.post('/tasks', (req, res) => {
    const { content } = req.body;
    if (!content) {
        return res.status(400).json({ error: 'Task content is required' });
    }
    db.addTask(content, (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(201).json(result);
        }
    });
});

// API Endpoint to update a task's completed status
app.put('/tasks/:id', (req, res) => {
    const { id } = req.params;
    const { completed } = req.body;

    db.updateTask(id, completed, (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(result);
        }
    });
});

// API Endpoint to delete a task
app.delete('/tasks/:id', (req, res) => {
    const { id } = req.params;

    db.deleteTask(id, (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(result);
        }
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


