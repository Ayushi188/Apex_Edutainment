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

app.get('/api/all-courses', async (req, res) => {
  try {
    const courses = await Course.find();
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











