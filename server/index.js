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
const Cart = require('./models/Cart');
const Order = require('./models/Order');
const Payment = require('./models/Payment');
const OrderItem = require('./models/orderItem');

const stripe = require('stripe')('sk_test_51OwHCkP1ms7owmBeDD4G1qiKfYBWTzYlwMgPe8BMnRqvQFqwSkydZS2ugtUVzXf1A7eaysPpExdFLioMirwbFGjq00vNesjpbx');
const nodemailer = require('nodemailer');
const VideoSubmission = require('./models/VideoSubmission');
const File = require('./models/File');
const Quiz = require('./models/Quiz');
const FeedbackForm = require('./models/FeedbackForm'); 

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
      filename: req.file.originalname,
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
app.get('/api/file/:courseId', async (req, res) => {
  try {
    const { courseId } = req.params;
    const files = await File.find({ courseId });
    if (!files) {
      return res.status(404).json({ message: 'Files not found for this course' });
    }
    return res.status(200).json({ files });
  } catch (error) {
    console.error('Error fetching files:', error);
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
//get data with course id
app.get('/api/videos/:courseId', async (req, res) => {
  try {
      const courseId = req.params.courseId;
      const videos = await VideoSubmission.find({ courseId });
      res.json({ videos });
  } catch (error) {
      console.error('Error fetching videos:', error);
      res.status(500).json({ message: 'Error fetching videos' });
  }
});

const createAdminUser = async () => {
  try {
    // Check if admin user already exists
    const adminUser = await UserModel.findOne({ email: 'admin@apex.ca' });
    if (!adminUser) {
      // Create admin user record
      const newAdminUser = new UserModel({
        "firstName": "Admin",
        "lastName": "Admin",
        "email": "admin@apex.ca",
        "reEmail": "admin@apex.ca",
        "role": "admin",
        "password": "123apex"
      });
      await newAdminUser.save();
      console.log('Admin user created successfully');
    } else {
      console.log('Admin user already exists');
    }
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
};

createAdminUser();
//nodemailer(gmail)
const transporter_1 = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'hardeepdhami02@gmail.com',
    pass: 'jozf wekv qlse vnuh' 
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
      userId: user._id, email: user.email, role: user.role, name:user.firstName, approved: user.approved
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
    console.log(decoded);
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

// Middleware function to verify JWT token
const verifyUser = (req, res, next) => {
  // Get token from headers
  const token = req.headers.authorization;

  // Check if token is provided
  if (!token) {
    return next();
  }

  // Verify token
  jwt.verify(token.replace('Bearer ', ''), 'apex_secret_key', (err, decoded) => {
    if (err) {
      return next();
    }
    req.user = decoded;
    return next();
  });
};

app.get('/api/courses',verifyUser, async (req, res) => {
  try {
    let courses;
    {req.user ? (
      req.user.role === "admin" ? (
        courses = await Course.find({ })
        ): (
          courses = await Course.find({status: "approved"})
        )
      ) : (
        courses = await Course.find({status: "approved"})
      )
    }
    
    //console.log(courses);
    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses from MongoDB:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/usercourses',verifyToken, async (req, res) => {
  try {
    var courses = [];
    const userId = req.user.userId;
    if(req.user.role === "admin")
    {
      courses = await Course.find({ status: "pending" });
    }
    else if(req.user.role === "teacher")
    {
      courses = await Course.find({ instructor: userId });
    }
    else
    {
      const studentEnrollments = await StudentEnrollment.find({ userId });

      const coursePromises = studentEnrollments.map(async (enrollment) => {
        try {
          // console.log(enrollment.courseId);
          const course = await Course.findById(enrollment.courseId);
          return course;
        } catch (error) {
          console.error('Error fetching course:', error);
          throw error; // Propagate the error up
        }
      });
  
      courses = await Promise.all(coursePromises);
    }
    // console.log(courses);
    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses from MongoDB:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//get data with course id
app.get('/api/courses/:courseId', async (req, res) => {
  try {
      const courseId = req.params.courseId;
      const course = await Course.findOne({ _id:courseId });
      console.log(course)
      res.json(course);
  } catch (error) {
      console.error('Error fetching course:', error);
      res.status(500).json({ message: 'Error fetching course' });
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

app.post('/api/feedbackForm',upload.single('file'),async (req, res) => {
  const { name, email, message } = req.body;
  const file = req.file; 

  try {
    const newFeedbackForm = new FeedbackForm({
      name,
      email,
      message,
      file: file ? file.path : null

    });

    await newFeedbackForm.save();

    const mailOptions = {
      from: 'hardeepdhami02@gmail.com',
      to: email,
      subject: 'We have Received Your Query',
      text: `Hello ${name},\n\nThank you for reaching out to us with your query. We have received it and want to assure you that your questions are important to us.\n\nOur team is currently reviewing your query and will provide you with a thorough response shortly. Please bear with us as we work to address your concerns.\n\nIn the meantime, if you have any additional information or urgent matters to discuss, feel free to reach out to us.\n\nThank you for choosing us to assist you with your query.\n\n\nBest regards,\nApex Team`
    };

    transporter_1.sendMail(mailOptions, function(error, info) {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });

    res.status(201).json({ message: 'Form submitted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
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

app.get('/api/all-courses', async (req, res) => {
  try {
    const courses = await Course.find({ status: 'approved' });
    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses from MongoDB:', error);
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

app.put('/register/approve/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    await UserModel.findByIdAndUpdate(userId, { approved: true });

    res.status(200).json({ message: 'User approved successfully' });
  } catch (error) {
    console.error('Error approving user:', error);
    res.status(500).json({ error: 'Failed to approve user. Please try again later.' });
  }
});

app.post('/api/cart/add', async (req, res) => {
    try {
        const { userId, courseId } = req.body;

       
        const cartData = await Cart.find();

        // Check if userId and courseId are provided
        if (!userId || !courseId) {
            return res.status(400).json({ error: 'userId and courseId are required' });
        }

        let isCourseInCart = false;
        for (const cartItem of cartData) {
          // Convert user_id and course_id of cart item to string for comparison
          const cartUserIdString = cartItem.user_id.toString();
          const cartCourseIdString = cartItem.course_id.toString();
    
          // Check if the courseId and userId match with the current cart item
          if (cartUserIdString === userId && cartCourseIdString === courseId) {
            isCourseInCart = true;
            break; // No need to continue searching if the course is found in cart
          }
        }
    
        if (isCourseInCart) {
          // If the course is already in the cart, send a response indicating it
          return res.status(200).json({ warning: 'Course already in cart' });
        }
    

        const cartItem = new Cart({
            user_id: userId,
            course_id: courseId,
            created_at: new Date()
        });

        const savedCartItem = await cartItem.save();
        res.status(201).json(savedCartItem);
    } catch (error) {
        console.error('Error adding course to cart:', error);
        res.status(500).json({ error: 'Failed to add course to cart' });
    }
});

// Route to fetch cart data
app.post('/api/cart-data', async (req, res) => {
  const { userId } = req.body;
  try {
    // Find the cart item by userId
    const cartItems = await Cart.find({ userId });
    if (!cartItems) {
      return res.status(404).json({ error: 'Cart data not found' });
    }
    // Fetch all courses
    const courses = await Course.find();
    if (!courses) {
      return res.status(404).json({ error: 'No courses found' });
    }

    // If cart data found, return it
    res.json({ cartItems, courses });
  } catch (error) {
    console.error('Error fetching cart data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to remove item from cart
app.post('/api/cart/remove', async (req, res) => {
  const { cartId } = req.body;
  try {
    // Remove the item from the cart by its id
    await Cart.deleteOne({ _id: cartId });
    res.json({ message: 'Course removed from cart successfully' });
  } catch (error) {
    console.error('Error removing item from cart:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/total-payable', async (req, res) => {
  const { userId } = req.body;
  try {
    // Find the cart items for the user
    const cartItems = await Cart.find({ userId });

    if (!cartItems || cartItems.length === 0) {
      return res.status(404).json({ error: 'Cart is empty' });
    }

    // Fetch the prices of the courses from the courses table
    const courseIds = cartItems.map(item => item.course_id);
    const courses = await Course.find({ _id: { $in: courseIds } });
    let totalAmount = 0;
    
    if (courses.length > 0) {
        courses.forEach(c => {
            totalAmount += parseInt(c.price);
        });
    }
    res.json({ totalAmount });
    
  } catch (error) {
    console.error('Error fetching cart total:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/create-order', async (req, res) => {
  try {
      const { formData ,total, userId} = req.body;

      const { firstName, lastName, phoneNumber, addressLine1, addressLine2, province, country, postalCode } = formData;

      const order = new Order({
        user_id: userId, // Convert objectId to string if userId is defined
        total_amount : total,
          status: 'Pending',
          createdAt: new Date(),
          billingAddress: {
              firstName,
              lastName,
              phoneNumber,
              addressLine1,
              addressLine2,
              province,
              country,
              postalCode
          }
      });
      await order.save();

      const cartItems = await Cart.find({ user_id: userId });

      for (const item of cartItems) {
        await OrderItem.create({
            orderId: order._id,
            courseId: item.course_id,
            userId,
            createdAt: new Date()
        });
    }

      const payment = new Payment({
          order_id: order._id,
          paymentDate: new Date(),
          amount: total,
          status: 'Pending'
      });
      await payment.save();
    console.log('order created')
      res.json({ orderId: order._id });

      // res.status(201).json({ orderId: order._id });
  } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/create-session', async (req, res) => {
  const {total, userId,orderId} = req.body;
  console.log('in session')
  const metadata = {
    orderId: orderId,
    // Add any other metadata fields you need
  };

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'cad',
          product_data: {
            name: 'Apex',
            // Other product details
          },
          unit_amount: total*100, // Amount in cents
        },
        quantity: 1, // Quantity of the product
      },
    ],
    mode: 'payment',
    cancel_url:'http://localhost:3001/api/cancel', 
    success_url: `http://localhost:3001/success?session_id={CHECKOUT_SESSION_ID}`,
    metadata: metadata,

  });
  res.json({ sessionId: session.id });


    //   if (session.payment_status === 'paid') {
    //     await Payment.updateOne(
    //         { orderId: order._id },
    //         { $set: { status: 'Success' } }
    //     );
  
    //     await Cart.deleteMany({ userId });
    
    //     res.redirect('/success');
    // } else {
    //     await Payment.updateOne(
    //         { orderId: order._id },
    //         { $set: { status: 'Failed' } }
    //     );
    //         res.redirect('/error');
    // }
});

// API endpoint for success redirect
app.get('/api/success-redirect', async (req, res) => {
  try {
      const { orderId } = req.query;
            await Payment.updateOne(
                { orderId: orderId },
                { $set: { status: 'Success' } }
            );
      
            await Cart.deleteMany({ userId });
        
            res.redirect('/payment-success');

      res.status(200).json({ message: 'Success redirect handled successfully', orderId });
  } catch (error) {
      console.error('Error handling success redirect:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

// API endpoint for cancel redirect
app.get('/api/cancel-redirect', async (req, res) => {
  try {
    const { orderId } = req.query;

    await Payment.updateOne(
              { orderId: orderId },
              { $set: { status: 'Failed' } }
          );
              res.redirect('/payment-failed');

      res.status(200).json({ message: 'Cancel redirect handled successfully' });
  } catch (error) {
      console.error('Error handling cancel redirect:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});








app.put('/register/reject/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    await sendRejectEmail(user.email);

    // Remove the user from the database
    await UserModel.findByIdAndDelete(userId);

    res.status(200).json({ message: 'User rejected and removed successfully' });
  } catch (error) {
    console.error('Error rejecting user:', error);
    res.status(500).json({ error: 'Failed to reject user. Please try again later.' });
  }
});


// Create a transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'apexdevelopment123@gmail.com',
    pass: 'itya lcod fsoa axxw'
  }
});

// Function to send email
const sendEmail = async (email) => {
  try {
    await transporter.sendMail({
      from: 'apexdevelopment123@gmail.com',
      to: email,
      subject: 'Account Approved',
      text: 'Your account has been approved. You can now login.'
    });
  } catch (error) {
    console.error('Error sending email:', error);
    throw error; // Rethrow the error to handle it elsewhere if needed
  }
};
app.post('/api/quizzes', upload.array('images', 10), async (req, res) => {
  try {
    const { title, courseId, questions } = req.body;
    const quiz = new Quiz({ title, courseId, questions });
    
    // Save image URLs to the database
    questions.forEach((question, index) => {
      if (req.files && req.files[index]) {
        question.image = req.files[index].path; // Assuming multer has saved images in the 'uploads/' directory
      }
    });
    
    await quiz.save();
    res.status(201).json({ message: 'Quiz created successfully' });
  } catch (error) {
    console.error('Error creating quiz:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//get data with course id
app.get('/api/quizzes/:courseId', async (req, res) => {
  try {
      const courseId = req.params.courseId;
      const quizzes = await Quiz.find({ courseId });
      res.json({ quizzes });
  } catch (error) {
      console.error('Error fetching quizzes:', error);
      res.status(500).json({ message: 'Error fetching quizzes' });
  }
});

//get data with quiz id
app.get('/api/quizzes/:quizId', async (req, res) => {
  try {
      const quizId = req.params.quizId;
      const quiz = await Quiz.find({ _id :quizId });
      console.log(quiz);
      console.error('fetched quiz:', error);
      res.json({ quiz });
  } catch (error) {
      console.error('Error fetching quiz:', error);
      res.status(500).json({ message: 'Error fetching quiz' });
  }
});


const sendRejectEmail = async (email) => {
  try {
    await transporter.sendMail({
      from: 'apexdevelopment123@gmail.com',
      to: email,
      subject: 'Accout Rejected',
      text: 'Your account has been rejected. Try again.'
    });
  } catch (error) {
    console.error('Error sending rejection email:', error);
    throw error; // Rethrow the error to handle it elsewhere if needed
  }
};

// Route to handle sending email
app.post("/send-email", async (req, res) => {
  const { email } = req.body;
  try {
    await sendEmail(email);
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

app.post("/send-reject-email", async (req, res) => {
  const { email } = req.body;
  try {
    await sendRejectEmail(email);
    res.status(200).json({ message: "Reject Email sent successfully" });
  } catch (error) {
    console.error("Error sending reject email:", error);
    res.status(500).json({ error: "Failed to send reject email" });
  }
});

app.get('/register', async (req, res) => {
  try {
    const pendingUsers = await UserModel.find({ approved: false });
    res.json(pendingUsers);
  } catch (error) {
    console.error('Error fetching pending users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// app.get('/pending-users', async (req, res) => {
//   try {
//     const pendingUsers = await UserModel.find({ approved: false });
//     res.json(pendingUsers);
//   } catch (error) {
//     console.error('Error fetching pending users:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

app.put('/api/approvecourse/:courseId', async (req, res) => {
  const course_Id = req.params.courseId; // Accessing the name parameter directly
  console.log("Course Name:", course_Id);

  const { status } = req.body;
  console.log("Status:", status);

  try {
    // Find the course by name and update its status
    const updatedCourse = await Course.findOneAndUpdate({ courseId: course_Id }, { status }, { new: true }).exec();
    if (!updatedCourse) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json(updatedCourse); // Respond with the updated course
  } catch (error) {
    console.error("Error updating course status:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/api/rejectcourse/:courseId', async (req, res) => {
  const course_Id = req.params.courseId; // Accessing the name parameter directly

  const { status } = req.body;
  console.log("Status:", status);

  try {
    // Find the course by name and update its status
    const updatedCourse = await Course.findOneAndUpdate({ courseId: course_Id }, { status }, { new: true }).exec();
    if (!updatedCourse) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json(updatedCourse); // Respond with the updated course
  } catch (error) {
    console.error("Error updating course status:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


