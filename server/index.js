// Requiring module
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const RegisterModel = require('./models/Register');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/Apex_Edutainment');

app.post('/register', async (req, res) => {
  try {
    const { email } = req.body; // Change this to match the key in the client-side data

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = await RegisterModel.findOne({ email });

    if (user) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // If everything is fine, create the user
    await RegisterModel.create(req.body); // Assuming your model accepts the entire req.body

    res.status(201).json({ success: 'Account created' });
  } catch (error) {
    console.error('Error during registration:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(3001, () => {
  console.log('Server is running');
});
