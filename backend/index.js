const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());  
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', 
    password: 'Mpkl@9948',  
    database: 'users'  
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to the database');
});

app.post('/register', (req, res) => {
    const { username, email, password, addresses, languages } = req.body;

    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) return res.status(500).send('Error hashing password');
        
        const query = 'INSERT INTO reg (username, email, password, address, languages) VALUES (?, ?, ?, ?,?)';
        db.query(query, [username, email, hashedPassword,JSON.stringify(addresses), JSON.stringify(languages)], (err, result) => {
            if (err) return res.status(500).send('Error inserting user into DB');
            res.status(200).json({ message: 'User registered successfully' });
        });
    });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const query = 'SELECT * FROM reg WHERE username = ?';
    db.query(query, [username], (err, result) => {
        if (err) return res.status(500).send('Database error');
        if (result.length === 0) return res.status(404).send('User not found');

        bcrypt.compare(password, result[0].password, (err, isMatch) => {
            if (err) return res.status(500).send('Error comparing passwords');
            if (!isMatch) return res.status(400).send('Invalid credentials');

            const token = jwt.sign({ id: result[0].id }, 'task1atAkrivia', { expiresIn: '1h' });
            res.status(200).json({ message: 'Login successful', token });
    
        });
    });
    
});

app.get('/user-details', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>
    if (!token) {
      return res.status(403).send('Token required');
    }
  
    // Verify the token
    jwt.verify(token, 'task1atAkrivia', (err, decoded) => {
      if (err) {
        return res.status(401).send('Invalid token');
      }
  
      const userId = decoded.id;
  
      // Fetch user details from the database
      const query = 'SELECT * FROM reg WHERE id = ?';
      db.query(query, [userId], (err, result) => {
        if (err) {
          console.error('Database query error:', err); // Log the error
          return res.status(500).send('Database error');
        }
        if (result.length === 0) {
          return res.status(404).send('User not found');
        }
  
        const user = result[0];
        res.status(200).json({
          username: user.username,
          email: user.email,
          address: user.address, // Parsing JSON data
          languages: user.languages, // Parsing JSON data
        });
      });
    });
  });
  
// Start the server
app.listen(3000, () => {
    console.log('Server running on port 3000');
});
