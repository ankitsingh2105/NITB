import React from 'react';
import "./Signup.css";

import firebaseConfig from '../../firebaseConfig';
import { initializeApp } from "firebase/app";
import { updateProfile, createUserWithEmailAndPassword, getAuth } from 'firebase/auth';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

import { Helmet } from 'react-helmet';

export default function Signup() {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const name = e.target.name.value;
        const email = e.target.email.value;
        const password = e.target.password.value;

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            toast("Sign up successful", { autoClose: 1500 });
            await updateProfile(auth.currentUser, { displayName: name });
            window.location.href = "/codeSection";
        } catch (e) {
            toast.error("Password should be at least 6 characters / Email already exists", { autoClose: 1700 });
        }
    };

    return (
        <main className="Signup_main">

            <ToastContainer />
            <Helmet>
                <title>CodeScribe NIT-B ~ Sign Up</title>
            </Helmet>

            <h1>
                Thank you for choosing Us
            </h1>

            <h2>~ Sign Up for free ~</h2>

            <form action="" onSubmit={handleSubmit} >
                <input type="text" placeholder='Name' name="name" required />
                <input type="email" placeholder='Email' name="email" required />
                <input placeholder='Password' type="password" name="password" required />
                <button onClick={() => { toast("Processing", { autoClose: 1500 }); }} >Sign Up</button>
            </form>

            <h2>Already have an account? Login here</h2>
            <button onClick={() => { window.location.href = "/login" }} >Log In</button>
            <br /><br />
        </main>
    )
}
