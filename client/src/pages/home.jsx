import React, { useEffect, useState } from 'react'
import AuthPage from './authPage'
import WaitingPage from './waitingPage'
import { StreamChat } from 'stream-chat'
import { Chat } from 'stream-chat-react';
import axios from 'axios';
import { environment } from '../../environment';

/**
 * Get the hostname from the current URL so that it can be used for API requests
 * For example, if the URL in the browser is http://localhost:3000, HOST will be 'localhost',
 * if the URL is http://example.com, HOST will be 'example.com'.
 * This is useful for making API requests to the backend server from a diferent machine and mantaining the cookies
 */
export const HOST = window.location.hostname;

const Home = () => {
  const client = StreamChat.getInstance(environment.api_key);

  const [authState, setAuthState] = useState('unauthenticated'); // 'authenticated', 'unauthenticated'

  const logOut = async () => {
    try {
      await 
        axios.post(`http://${HOST}:9000/api/logout`, {}, { 
          withCredentials: true 
        });
      await client.disconnectUser();
      setAuthState('unauthenticated');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const connectUser = async (userId, username, firstName, token) => {
    try {
      await client.connectUser(
        {
          id: userId,
          username: username,
          firstName: firstName,
          name: firstName
        },
        token
      );
      setAuthState('authenticated');
    } catch (error) {
      // If the token is invalid or expired, handle the error
      // refresh token
      try {
        const newToken = await refreshToken();
        await client.connectUser(
          {
            id: userId,
            username: username,
            firstName: firstName,
          },
          newToken
        );
        setAuthState('authenticated');
      } catch (refreshError) {
        console.error('Error refreshing token:', refreshError);
        setAuthState('unauthenticated');
      }
    }
  };

  const refreshToken = async () => {
    try {
      const response = await axios.get(`http://${HOST}:9000/api/refresh-token`, {
        withCredentials: true
      });
      return response.data.newToken;
    } catch (error) {
      console.error('Error refreshing token:', error);
      throw error;
    }
  }

  useEffect(() => {
    const checkAuthSession = async () => {

      try {
        // Check if there's an active session by calling the backend
        const response = await 
          axios.get(`http://${HOST}:9000/api/me`, { 
            withCredentials: true 
          });
        const { userId, userName, firstName, token } = response.data;

        // If the session is valid, connect the user to StreamChat
        if (userId && userName && firstName && token) {
          await connectUser(userId, userName, firstName, token);
        }

      } catch (error) {
        console.error("No active session found or error checking session:", error);
      }
    };

    // Only check the auth session if the client is not already connected
    if (!client.userID) {
      checkAuthSession();
    }
  }, []); // Run once on component mount

  return (
    <div className='min-h-screen flex items-center justify-center'>
      {authState === 'authenticated' ? (
      <Chat client={client}>
        <WaitingPage logout={logOut} />
      </Chat>
    ) : authState === 'unauthenticated' ? (
      <AuthPage onAuthSuccess={connectUser} />
    ) : (
      <p>Loading...</p>
    )}
    </div>
  );
}

export default Home