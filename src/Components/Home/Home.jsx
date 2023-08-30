import React from 'react'
import "./Home.css"
import HomeImg from "./Linkbee_Home_Image.webp"

import { getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { doc, getDoc, getFirestore } from "firebase/firestore";
import firebaseConfig from '../../firebaseConfig';
import bee from "./elem2.webp";
export default function Home(props) {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);
    let user = auth.currentUser;
    console.log("this is the curret user-> " , user);
    const handleNavigation = () => {
        let user = auth.currentUser;
        if (user) {
            async function Wait() {
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);
                window.location.href = `/user/auth/edit/${docSnap.data().userID}`
            }
            Wait();
        }
        else {
            console.log("this is not authorizes");
            window.location.href = "/unauth/tempUser";
        }
    }
    return (
        <main className="main_home" id={props.id} >
            {/* <img style={{ width: "100px", height: "100px" }} className="floating_bee" src={bee} alt="" /> */}
            <div className='align'>
                <h1>
                Ignite Discoveries
                </h1>
                <h1>
                CodeScribe NIT-B
                </h1>
                <div className="align">
                    <p>
                    Welcome to <b>CodeScribe NIT-B: Ignite Discoveries.</b> Our platform stands as a beacon for the ingenious minds of MCA students from MANIT Bhopal. With the aim to foster learning and collaboration, we offer a specialized haven for aspiring coders to intricately capture, share, and celebrate their code snippets, fostering a community where innovation knows no bounds.
                    </p>
                    <div className="align2">
                        <button onClick={() => { window.location.href = "/login" }} >Get Started</button>
                    </div>
                </div>
            </div>
            {/* <img onClick={() => { window.location.href = "http://linkbee.online/ankit21" }} src={HomeImg} alt="" /> */}
        </main>
    )
}
