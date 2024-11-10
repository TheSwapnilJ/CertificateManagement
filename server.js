const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');


const app = express();
app.use(bodyParser.json()); 

app.use(cors());
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', 
    password: 'Swapnil@301196', 
    database: 'certificate_db' 
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to the database: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL database');
});




app.get('/categories', (req, res) => {
    db.query('SELECT * FROM categories', (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(results);
    });
});


app.post('/categories', (req, res) => {
    const { name } = req.body;
    db.query('INSERT INTO categories (name) VALUES (?)', [name], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({ message: 'Category created', id: results.insertId });
    });
});


app.get('/questions/:categoryId', (req, res) => {
    const { categoryId } = req.params;
    db.query('SELECT * FROM questions WHERE category_id = ?', [categoryId], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(results);
    });
});

app.post('/questions', (req, res) => {
    const { question_text, category_id } = req.body;
    db.query('INSERT INTO questions (question_text, category_id) VALUES (?, ?)', [question_text, category_id], (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({ message: 'Question created', id: results.insertId });
    });
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
