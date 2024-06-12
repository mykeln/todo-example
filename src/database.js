const sqlite3 = require('sqlite3').verbose();

// Create a new database instance and open a connection to an SQLite database file.
const db = new sqlite3.Database('./todo.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error('Error opening database ' + err.message);
    } else {
        console.log('Database connected.');
        // Initialize the database structure as soon as the connection is open.
        initDatabase();
    }
});

// Function to initialize the database tables
function initDatabase() {
    db.run(`CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        content TEXT NOT NULL,
        completed BOOLEAN NOT NULL DEFAULT FALSE
    )`, (err) => {
        if (err) {
            console.error('Error creating tasks table: ' + err.message);
        } else {
            console.log('Tasks table is ready.');
        }
    });
}

// Function to add a new task
function addTask(content, callback) {
    const sql = `INSERT INTO tasks (content, completed) VALUES (?, FALSE)`;
    db.run(sql, [content], function(err) {
        if (err) {
            callback(err);
        } else {
            callback(null, { id: this.lastID, content, completed: false });
        }
    });
}

// Function to retrieve all tasks
function getAllTasks(callback) {
    const sql = `SELECT id, content, completed FROM tasks`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            callback(err);
        } else {
            callback(null, rows);
        }
    });
}

// Function to update a task's completed status
function updateTask(id, completed, callback) {
    const sql = `UPDATE tasks SET completed = ? WHERE id = ?`;
    db.run(sql, [completed, id], function(err) {
        if (err) {
            callback(err);
        } else {
            callback(null, { id, completed });
        }
    });
}

// Function to delete a task
function deleteTask(id, callback) {
    const sql = `DELETE FROM tasks WHERE id = ?`;
    db.run(sql, [id], function(err) {
        if (err) {
            callback(err);
        } else {
            callback(null, { id });
        }
    });
}

module.exports = {
    initDatabase,
    addTask,
    getAllTasks,
    updateTask,
    deleteTask
};

