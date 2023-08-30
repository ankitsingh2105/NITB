import React from 'react'
import "./Home.css"

import { getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { doc, getDoc, getFirestore } from "firebase/firestore";
import firebaseConfig from '../../firebaseConfig';
export default function Home(props) {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);
    let user = auth.currentUser;
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
            window.location.href = "/unauth/tempUser";
        }
    }
    return (
        <main className="main_home" id={props.id} >
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
        </main>
    )
}
