// Requiring module
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const UserModel = require('./models/User');
const Course = require('./models/Course'); 
const StudentEnrollment = require('./models/StudentEnrollment'); 
const VideoSubmission = require('./models/VideoSubmission');
const File = require('./models/File');

const app = express();
app.use(cors());
app.use(express.json());
//app.use(express.static(path.join(__dirname, 'uploads')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect('mongodb://127.0.0.1:27017/Apex_Edutainment');
// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });
//course content for extra material
app.post('/api/file', upload.single('file'), async (req, res) => {
  try {
    const { courseId } = req.body;
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const newFile = new File({
      filename: req.file.filename,
      path: req.file.path,
      courseId: courseId

    });
    await newFile.save();
    return res.status(201).json({ message: 'File uploaded successfully', file: newFile });
  } catch (error) {
    console.error('Error uploading file:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});
// Route to handle video submissions
app.post('/api/submitVideos', async (req, res) => {
  try {
      const { videoUrl, courseId } = req.body;
      const videoSubmission = new VideoSubmission({ videoUrl, courseId });
      const savedVideoSubmission = await videoSubmission.save();
      res.status(201).json(savedVideoSubmission);
  } catch (error) {
      console.error('Error submitting videos:', error);
      res.status(500).json({ message: 'Error submitting videos' });
  }
});

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

    payload = {
      userId: user._id, email: user.email, role: user.role, name:user.firstName
    };

    // Generate JWT token
    const token = jwt.sign(payload, 'apex_secret_key', { expiresIn: '1h' });

    // Send token as a response
    res.json({ token, payload});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
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


app.get('/api/courses',verifyToken, async (req, res) => {
  try {
    var courses = [];
    const userId = req.user.userId;
    if(req.user.role === "teacher")
    {
      courses = await Course.find({ instructor: userId });
    }
    else{
      const studentEnrollments = await StudentEnrollment.find({ userId });
      for (const enrollment of studentEnrollments) {
        console.log(enrollment.courseId);
        const course = await Course.findOne({ courseId: enrollment.courseId });
        if (course) {
          courses.push(course);
        }
      }
      // studentEnrollments.forEach(enrollment => {
      //   console.log(enrollment.courseId);
      //   var course = await Course.findOne({ courseId: enrollment.courseId })
      //   courses =[...courses, course ]
      // });
    }
    //console.log(courses);
    //console.log(JSON.stringify(courses));
    res.json(JSON.parse(JSON.stringify(courses)));
  } catch (error) {
    console.error('Error fetching courses from MongoDB:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.post('/api/courses', upload.single('image'), async (req, res) => {
  try {
    const { courseId, name, description, duration, instructor } = req.body;
    const imagePath = req.file.path;
    const course = new Course({ courseId, name, description, duration, instructor, imagePath });
    await course.save();
    //res.status(201).send(course);
    res.status(201).json({ success: true, message: 'Course added successfully' });

  } catch (error) {
    //res.status(400).send(error);
    console.error('Error adding course:', error);
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






