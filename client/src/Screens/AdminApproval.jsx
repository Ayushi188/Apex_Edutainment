
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaUser } from "react-icons/fa";
import Navbar from './Navbar';
import '../assets/AdminPage.css'


const AdminApproval = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [courses, setCourses] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchPendingUsers();
    fetchUser();
    fetchCourses();
  }, []);


  const fetchUser = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/user', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setUser(response.data.user);
      console.log('user fetched:'+ response.data.user);
    } catch (error) {
      console.error('Error fetching user:', error);
      setUser(null);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/usercourses', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setCourses(response.data);
      console.log('courses fetched:');
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setCourses(null);
    }
  };

  const fetchPendingUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3001/register");
      const pendingUsers = response.data.filter(user => !user.approved && !user.rejected);
      console.log("Response data:", response.data);
      setPendingUsers(pendingUsers);
    } catch (error) {
      console.error("Error fetching pending users:", error);
    }
  };
 
  const approveUser = async (userId, userEmail) => {
    try {
      await axios.put(`http://localhost:3001/register/approve/${userId}`);
      window.location.reload();
      await sendEmail(userEmail);
      setPendingUsers(pendingUsers.filter(user => user._id !== userId));
    } catch (error) {
      console.error("Error approving user:", error);
    }
  };

  const rejectUser = async (userId, userEmail) => {
    try {
      await axios.put(`http://localhost:3001/register/reject/${userId}`);
      window.location.reload();
      await sendRejectEmail(userEmail);
      setPendingUsers(pendingUsers.filter(user => user._id !== userId));
    } catch (error) {
      console.error("Error rejecting user:", error);
    }
  };

  const sendEmail = async (email) => {
    try {
      await axios.post("http://localhost:3001/send-email", { email });
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  const sendRejectEmail = async (email) => {
    try {
      await axios.post("http://localhost:3001/send-reject-email", { email });
    } catch (error) {
      console.error("Error sending rejection email:", error);
    }
  };

  
  return (
    <div> 
      <Navbar courses={courses} user={user}/>
      <div className="pending-user">
        <h1 className="user-title">Pending Signups</h1>
        <div className="user-list">
          {pendingUsers.map(user => (
            <div key={user._id} className="user-item">
              <div>
                <div className="user-info">
                  <div className="user-icon"><FaUser /></div>
                  <div className="user-text">
                    <div><strong>Role:</strong> {user.role}</div>
                    <div><strong>Firstname:</strong> {user.firstName}</div>
                    <div><strong>Email:</strong> {user.email}</div>
                    <div><strong>User ID:</strong> {user._id}</div>
                  </div>
                </div>
              </div>
              <div className="user-actions">
                <button className="approve-btn" onClick={() => approveUser(user._id, user.email)}>Approve</button>
                <button className="reject-btn" onClick={() => rejectUser(user._id, user.email)}>Reject</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminApproval;
