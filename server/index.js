// Requiring module
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const UserModel = require('./models/User');
const Course = require('./models/Course'); 
const StudentEnrollment = require('./models/StudentEnrollment'); 
const app = express();
app.use(cors());
app.use(express.json());
const path = require('path');

app.use(express.static(path.join(__dirname, 'uploads')));


mongoose.connect('mongodb://127.0.0.1:27017/Apex_Edutainment');

app.post('/register', async (req, res) => {
  try {
    const { email } = req.body; // Change this to match the key in the client-side data

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = await UserModel.findOne({ email });

    if (user) {
      return res.status(409).json({ error: 'User already exists' });
    }

    // If everything is fine, create the user
    await UserModel.create(req.body); // Assuming your model accepts the entire req.body

    res.status(201).json({ success: 'Account created' });
  } catch (error) {
    console.error('Error during registration:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists in the database
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if the password is correct
    const isValidPassword = await user.isValidPassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, email: user.email, role: user.role }, 'apex_secret_key', { expiresIn: '1h' });

    // Send token as a response
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/enroll', async (req, res) => {
  try {
    const { userId, courseId } = req.body;
    const enrollment = new StudentEnrollment({
      userId,
      courseId,
      enrollmentDate: new Date()
    });
    await enrollment.save();
    res.status(200).json({ message: 'Enrollment successful' });
  } catch (error) {
    console.error('Error enrolling in courses:', error);
    res.status(500).json({ error: 'Failed to enroll in courses. Please try again later.' });
  }
});


app.get('/api/courses', async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses from MongoDB:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.listen(3001, () => {
  console.log('Server is running');
});

app.get('/api/student-enrollments/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Fetch student enrollments for the specified user
    const studentEnrollments = await StudentEnrollment.find({ userId });

    res.json(studentEnrollments);
  } catch (error) {
    console.error('Error fetching student enrollments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/course-enrollments/:userId/:courseId', async (req, res) => {
  try {
    const { userId, courseId } = req.params;
    await StudentEnrollment.deleteOne({ userId, courseId });
    res.status(200).json({ message: 'Enrollment removed successfully' });
  } catch (error) {
    console.error('Error deleting enrollment:', error);
    res.status(500).json({ error: 'Failed to delete enrollment. Please try again later.' });
  }
});





// Middleware function to verify JWT token
const verifyToken = (req, res, next) => {
  // Get token from headers
  const token = req.headers.authorization;

  // Check if token is provided
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  // Verify token
  jwt.verify(token.replace('Bearer ', ''), 'apex_secret_key', (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Failed to authenticate token' });
    }
    req.user = decoded;
    next();
  });
};

// Protected route
app.get('/api/user', verifyToken, (req, res) => {
  // If token is valid, req.user will contain decoded token payload
  res.json({ user: req.user });
});
