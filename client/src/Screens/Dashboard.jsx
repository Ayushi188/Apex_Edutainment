import React ,{ useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import  Footer from './Footer';
export default function Dashboard() {

  const [user, setUser] = useState(null);

  useEffect(() => {
    // Function to fetch user data when the component mounts
    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/user', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setUser(response.data.user);
        console.log('user fetched:');
      } catch (error) {
        // Handle error, e.g., token expired or invalid
        console.error('Error fetching user:', error);
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  return (   
    //placeholder for dashboard page, will be removed when implementation is done
    <div className="container">
        <Navbar />
        {user && 
          (<div><h1>{user.role}</h1></div>)
        }
        {console.log(user)}
        <Footer/>
    </div>
  );
}