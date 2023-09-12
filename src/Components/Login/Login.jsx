import React  , {useState} from 'react';
import "./Login.css"
import { initializeApp } from "firebase/app";
import firebaseConfig from '../../firebaseConfig'

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';

import { Helmet } from 'react-helmet';

export default function Login() {

  const [passEmail, setpassEmail] = useState("")

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  const handleLogin = async (e) => {
    e.preventDefault();
    toast("Checking Credentials", { autoClose: 1500 });
    const email = e.target.email.value;
    const password = e.target.password.value;
    try {
      e.target.email.value = "";
      e.target.password.value = "";
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Logging in", { autoClose: 1500 });
      window.location.href = `/codeSection`;
    } catch (error) {
      toast.error("Invalid Credentials", { autoClose: 1500 });
    }
  }

  const forgotPass = async () => {
    console.log("this is happening");
    await sendPasswordResetEmail(auth, passEmail);
    try{
      toast.success("Email Sent please check you mail account" , {autoClose : 1500});
    }
    catch{
      toast.error("Something went wrong" , {autoClose : 1500});
    }

  }

  const handleEmail = (e)=>{
    console.log(e.target.value);
    setpassEmail(e.target.value);
  }

  return (
    <main className="Login_main">

      <ToastContainer />
      <Helmet>
        <title>CodeScribe NIT-B ~ Log In</title>
      </Helmet>

      <h1>
        Welcome back to CodeScribe NITB
      </h1>
      <h2>~ Login to you CodeScribe NIT-B account ~</h2>
      <form onSubmit={handleLogin} action="">
        <input onChange={handleEmail} type="email" placeholder='Email' name="email" />
        <input placeholder='Password' type="password" name="password" />
        <button>Login</button>
      </form>
      <h2>Don't have an account? Sign Up here</h2>
      <button onClick={() => { window.location.href = `/signup` }} >Sign Up</button>
      <br />
      <button onClick={ ()=> {forgotPass()}} >Forgot Password?</button>
      <br />
      <br />
    </main>
  )
}