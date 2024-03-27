import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import Footer from './Footer';
import '../assets/cartStyle.css';
import Swal from 'sweetalert2';

const Cart = () => {
  const [courses, setCourses] = useState([]);
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    fetchUser();
    fetchCartItems();
  }, []);

  const fetchUser = async () => {
    try {
    const response = await axios.get('http://localhost:3001/api/user', {
        headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    });
    setUser(response.data.user);
    console.log(response.data.user);
    if(response.data.user == null || response.data.user == [])
    {
        Swal.fire({
            icon: 'error',
            title: 'Access Denied',
            text: 'You do not have permission to access this page.',
            showConfirmButton: false,
            timer: 2000
        });
        window.location.href = '/home';
      }

    } catch (error) {
        console.error('Error fetching user:', error);
        setUser(null);
            Swal.fire({
                icon: 'error',
                title: 'Access Denied',
                text: 'You do not have permission to access this page.',
                showConfirmButton: false,
                timer: 2000
            });
            window.location.href = '/home';
            // Handle error, e.g., token expired or invalid
        
        }
};

  const fetchCartItems = async (userId) => {
    try {
      const response = await axios.post(`http://localhost:3001/api/cart-data`, { userId });
      console.log('Cart items fetched');
      const mergedCartItems = response.data.cartItems.map(cartItem => {
        if (cartItem.course_id) {
          const course = response.data.courses.find(course => course._id === cartItem.course_id);
          if (course) {
            return { ...cartItem, course };
          }
        }
        return null;
      }).filter(item => item !== null);
      console.log('Merged cart items with courses:', mergedCartItems);
      setCartItems(mergedCartItems);
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };
  

  const handleRemoveItem = async (cartId) => {
    // Confirm removal with the user
    const result = await Swal.fire({
      title: 'Confirmation',
      text: 'Are you sure you want to remove this item from the cart?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, remove it!'
    });
  
    // If the user confirms, proceed with the removal
    if (result.isConfirmed) {
      try {
        // Send a POST request to remove the item from the cart
        await axios.post(`http://localhost:3001/api/cart/remove`, { cartId: cartId });
        // Fetch updated cart items
        fetchCartItems();
      } catch (error) {
        console.error('Error removing item from cart:', error);
      }
    }
  };
  

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + parseInt(item.course.price), 0);
  };

  return (
    <div>
      <Navbar user={user} />
      <section className="course-content cart-widget">
            <div className="container">
                <div className="student-widget">
                    <div className="student-widget-group">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="cart-head">
                                <h4>Your cart ({cartItems.length} items)</h4>
                                </div>
                                <div className="cart-group">
                                {cartItems.map((item) => (
                                <div key={item.courseId} className="row">
                                        <div className="col-lg-12 col-md-12 d-flex">
                                            <div className="course-box course-design list-course d-flex">
                                            <div className="product">
                                                <div className="product-img">
                                                    <a href="course-details.html">
                                                    <img width="250px" height="170px" src={'http://localhost:3001/'+item.course.imagePath}  alt={item.course.name} />
                                                    </a>
                                                    <div className="price">
                                                        <h3 className="free-color">${item.course.price}</h3>
                                                    </div>
                                                </div>
                                                <div className="product-content">
                                                    <div className="head-course-title">
                                                        <h3 className="title"><a href="course-details.html">{item.course.name}</a></h3>
                                                    </div>
                                                    <div className="course-info d-flex align-items-center border-bottom-0 pb-0">
                                                        <div className="rating-img d-flex align-items-center">
                                                            <img src="/img/icon/icon-01.svg" alt="" />
                                                            <p>12+ Lesson</p>
                                                        </div>
                                                        <div className="course-view d-flex align-items-center">
                                                            <img src="/img/icon/icon-02.svg" alt="" />
                                                            <p>9hr 30min</p>
                                                        </div>
                                                    </div>
                                                    <div className="rating">
                                                        <img width="20" height="20" src="https://img.icons8.com/emoji/48/star-emoji.png" alt="star-emoji"/>                              
                                                        <img width="20" height="20" src="https://img.icons8.com/emoji/48/star-emoji.png" alt="star-emoji"/>
                                                        <img width="20" height="20" src="https://img.icons8.com/emoji/48/star-emoji.png" alt="star-emoji"/>
                                                        <img width="20" height="20" src="https://img.icons8.com/emoji/48/star-emoji.png" alt="star-emoji"/>
                                                        <span className="d-inline-block average-rating"><span>4.0</span> (15)</span>
                                                    </div>
                                                </div>
                                                <div className="cart-remove">
                                                    <button onClick={() => handleRemoveItem(item._id)} className="btn btn-primary">Remove&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</button>
                                                </div>
                                            </div>

                                            </div>
                                        </div>
                                        
                                    </div>
                                    ))}

                                </div>

                                <div className="cart-total">
                                    <div className="row">
                                        <div className="col-lg-12 col-md-12">
                                            <div className="cart-subtotal">
                                            <p>Subtotal: ${calculateSubtotal()}</p>
                                            </div>
                                        </div>
                                        <div className="col-lg-6 col-md-6">
                                            <div className="check-outs">
                                                <a href="/checkout" className="btn btn-primary">Checkout</a>
                                            </div>
                                        </div>
                                        <div className="col-lg-6 col-md-6">
                                            <div className="condinue-shop">
                                                <a href="/courses" className="btn btn-primary">Continue Shopping</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
      <Footer />
    </div>
  );
};

export default Cart;
