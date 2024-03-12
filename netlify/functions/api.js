const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const serverless = require('serverless-http');

const app = express();
const port = 3000;

app.use(bodyParser.json());


const users = [];


const getUserById = (id) => users.find(user => user.id === id);


app.get('/users', (req, res) => {
  res.json({ message: "Users retrieved", success: true, users });
});

app.post('/add', (req, res) => {
  const { email, firstName } = req.body;
  if (!email || !firstName) {
    return res.status(400).json({ message: "Invalid user data. Email and firstName are required.", success: false });
  }
  const newUser = { id: uuidv4(), email, firstName };
  users.push(newUser);
  res.status(201).json({ message: "User added", success: true });
});

app.put('/update/:id', (req, res) => {
  const { id } = req.params;
  const { email, firstName } = req.body;
  const user = getUserById(id);

  if (!user) {
    return res.status(404).json({ message: "User not found.", success: false });
  }

  user.email = email || user.email;
  user.firstName = firstName || user.firstName;

  res.json({ message: "User updated", success: true });
});

app.get('/user/:id', (req, res) => {
  const { id } = req.params;
  const user = getUserById(id);
  if (!user) {
    return res.status(404).json({ message: "User not found.", success: false });
  }
  res.json({ success: true, user });
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "An unexpected error occurred.", success: false });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

module.exports.handler = serverless(app);
