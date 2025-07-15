import axios from 'axios';
import React, { useState } from 'react'
import { HOST } from './home';

const AuthPage = ({ onAuthSuccess }) => {
    const [loginMode, setLoginMode] = useState(true);
    const [errorMessage, setErrMessage] = useState("");
    const [credentials, setCredentials] = useState({
        username: '',
        password: '',
        fullname: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prev => ({ ...prev, [name]: value }));
    };

    const submitLogIn = async () => {
        setErrMessage("");
        try {
            await axios.post(
                `http://${HOST}:9000/api/login`,
                { username: credentials.username, password: credentials.password },
                { 
                    headers: {'Content-Type': 'application/json'},
                    withCredentials: true // VERY IMPORTANT: This allows cookies to be sent with the request
                }
            ).then(response => {
                if (response.status === 200) {
                    const { userId, token, firstName, userName } = response.data;

                    // Call the onAuthSuccess function passed from Home component
                    onAuthSuccess(userId, userName, firstName, token);
                }
            });

        } catch(error) {
            if (error.response) {
                if (error.response.status === 401) {
                    setErrMessage("Invalid Credentials");
                } else if (error.response.status === 404) {
                    setErrMessage("User not found");
                } else {
                    setErrMessage(`Server error: ${error.response.status}`);
                }
            } else {
                setErrMessage("Network error or server is down.");
            }
        }
    }

    const submitSignUp = async () => {
        setErrMessage("");
        try {
            const [firstName, ...lastNameParts] = credentials.fullname.split(' ');
            const lastName = lastNameParts.join(' ');

            await axios.post(
                `http://${HOST}:9000/api/signup`,
                { 
                    firstName: firstName, 
                    lastName: lastName, 
                    userName: credentials.username, 
                    password: credentials.password 
                },
                { 
                    headers: {'Content-Type': 'application/json'},
                    withCredentials: true // VERY IMPORTANT: This allows cookies to be sent with the request
                }
            ).then(response => {
                if (response.status === 201) {
                    const { userId, token, firstName, userName } = response.data;

                    // Call the onAuthSuccess function passed from Home component
                    onAuthSuccess(userId, userName, firstName, token);
                }
            });
        } catch(error) {
            if (error.response) {
                if (error.response.status === 409) {
                    setErrMessage("User already exists");
                } else {
                    setErrMessage('Internal server error');
                }
            } else {
                setErrMessage("Network error or server is down.");
            }
        }
    }

    return (
        <div className='h-96 w-96 flex flex-col justify-around items-center bg-slate-200 border-2 border-slate-400'>
            {loginMode ? (
                <div className='flex flex-col items-center gap-2'>
                    <label className='text-5xl'>Log In</label>
                    <br />
                    <input key={1} name='username' className='p-1 rounded-md' type="text" placeholder='Username' onChange={handleInputChange} required/>
                    <input key={2} name='password' className='p-1 rounded-md' type="text" placeholder='Password' onChange={handleInputChange} required/>
                    <p className='text-red-700'>{errorMessage}</p>
                    <button className='w-16 p-1 rounded-md text-white bg-lime-600' onClick={submitLogIn}>Log In</button>
                </div>
            ) : (
                <div className='flex flex-col items-center gap-2'>
                    <label className='text-5xl'>Sign Up</label>
                    <br />
                    <input key={3} name='fullname' className='p-1 rounded-md' type='text' placeholder='Primeiro e último nome' onChange={handleInputChange} required/>
                    <input key={1} name='username' className='p-1 rounded-md' type="text" placeholder='Username' onChange={handleInputChange} required/>
                    <input key={2} name='password' className='p-1 rounded-md' type="text" placeholder='Password' onChange={handleInputChange} required/>
                    <p className='text-red-700'>{errorMessage}</p>
                    <button className='w-20 p-1 rounded-md text-white bg-lime-600' onClick={() => submitSignUp()}>Sign Up</button>
                </div>
            )}
            <button className='w-24 p-1 rounded-md text-white bg-blue-500' onClick={() => { setLoginMode(!loginMode); setErrMessage("") }}>
                {loginMode ? ("Sign Up") : ("Log In")}
            </button>
        </div>
    )
}

export default AuthPage;
