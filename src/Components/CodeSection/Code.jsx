import React, { useEffect, useRef, useState } from 'react'
import { getAuth, signOut, onAuthStateChanged, connectAuthEmulator } from 'firebase/auth'
import { initializeApp } from 'firebase/app';
import { ToastContainer, toast } from 'react-toastify';
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import firebaseConfig from '../../firebaseConfig';
import { Helmet } from 'react-helmet';
import "./Code.css";
import logo from "./logo.png"
import 'react-toastify/dist/ReactToastify.css';

export default function Code() {

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    let user = auth.currentUser;
    const db = getFirestore(app);

    const blurEff = useRef();
    const codeData = useRef();
    const codeTitle = useRef();
    const [viewEditor, setviewEditor] = useState(false);
    const [nameofLang, setnameofLang] = useState("");
    const [array, setarray] = useState([]);
    const [loading, setloading] = useState(true);

    const proLang = async (e) => {
        setviewEditor(true);
        setnameofLang(e);
    }
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                async function operate() {
                    const docRef = doc(db, "users", user.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        setarray(docSnap.data().arrayOfObject || []);
                    }
                    setloading(false);
                }
                operate();
            }
        });

        return () => {
            unsubscribe();
        }
    }, []);

    function getCurrentTimeAndDay() {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 || 12;
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
        const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
        const currentTime = `${formattedHours}:${formattedMinutes}:${formattedSeconds} ${ampm}`;

        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayName = days[now.getDay()];

        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        const day = now.getDate();
        const currentDate = `${month}/${day}/${year}`;

        const fullDateTime = `${currentTime},  ${dayName}, ${currentDate}`;
        return fullDateTime;
    }


    const handleClose = async () => {
        setviewEditor(false);
    }

    const handleSave = async () => {

        let user = auth.currentUser;
        if (!user) {
            toast.error("Something went wrong here");
            return;
        }
        let obj = {
            "name": nameofLang,
            "codeInfo": codeData.current.value,
            "dateAndTime": getCurrentTimeAndDay(),
            "codeTitle" : codeTitle.current.value || "No title"
        }
        let tempArray = [];
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            tempArray = docSnap.data().arrayOfObject || [];
        }
        tempArray.push(obj);
        setarray(tempArray);
        const info = docSnap.data();
        setDoc(docRef, {
            ...info, arrayOfObject: tempArray,
        });
        setviewEditor(false);
    }

    const handleCodeDelete = async (codetime) => {
        let newTemp = array.filter((e) => {
            return e.dateAndTime !== codetime;
        });
        setarray(newTemp);
        let user = auth.currentUser;
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        const info = docSnap.data();
        setDoc(docRef, {
            ...info, arrayOfObject: newTemp,
        });
    }
    const handleCopy = async (textToCopy) => {
        try {
            await navigator.clipboard.writeText(textToCopy);
            console.log('Text copied to clipboard');
            toast.success("Code Copied to clipboard" , {autoClose:1700});
        }
        catch (error) {
            console.error('Error copying to clipboard:', error);
        }
    }

    const dayandData = getCurrentTimeAndDay();

    return (
        <>
            <main ref={blurEff} className="align code_main">
                <ToastContainer className="custom-toast" />
                <Helmet>
                    <title>CodeScribe NIT-B | CODES</title>
                </Helmet>
                <nav className="code_nav" >
                    <ul>
                        <li><img style={{ margin: "0px" }} onClick={() => { window.location.href = "/" }} src={logo} alt="logo image" /></li>
                    </ul>
                </nav>
                <section className='SecondSection' >
                    <h3>~Welcome <b style={{ color: "#ff2d2d" }} >{user?.displayName}</b> ~</h3>
                    <h2>~Select programming language~</h2>
                    <ul className='proGrammingLangs'>
                        <li onClick={() => { proLang("HTML") }} ><i style={{ color: "red" }} class="fa-brands fa-html5"></i></li>
                        <li onClick={() => { proLang("CSS") }} ><i style={{ color: "blue" }} class="fa-brands fa-css3-alt"></i></li>
                        <li onClick={() => { proLang("Javascript") }} ><i style={{ color: "yellow" }} class="fa-brands fa-js"></i></li>
                        <li style={{ color: "blue" }} onClick={() => { proLang("C") }} ><small>C</small></li>
                        <li style={{ color: "blue" }} onClick={() => { proLang("C++") }} > <small>C++</small></li>
                        <li onClick={() => { proLang("Reactjs") }} ><i style={{ color: "skyblue" }} class="fa-brands fa-react"></i></li>
                        <li onClick={() => { proLang("Java") }} ><i style={{ color: "orange" }} class="fa-brands fa-java"></i></li>
                        <li onClick={() => { proLang("Python") }} ><i style={{ color: "yellow" }} className="fa-brands fa-python"></i></li>
                        <li onClick={() => { proLang("PHP") }} ><i style={{ color: "purple" }} className="fa-brands fa-php"></i></li>
                        <li onClick={() => { proLang("Rust") }} ><i style={{ color: "gray" }} className="fa-brands fa-rust"></i></li>
                        <li onClick={() => { proLang("Vue.js") }} ><i style={{ color: "green" }} className="fa-brands fa-vuejs"></i></li>
                        <li onClick={() => { proLang("Angular") }} ><i style={{ color: "red" }} className="fa-brands fa-angular"></i></li>
                    </ul>
                </section>
                {
                    viewEditor ?
                        (<main style={{ marginTop: "3.3rem" }} className='in_codes'>
                            <h3>{nameofLang}</h3>
                            <h4>{dayandData}</h4>
                            <input placeholder='Enter File Name' ref={codeTitle} type="text"/>
                            <textarea className='CodeTextArea' ref={codeData} placeholder="Enter you code here" cols="100" rows="23"></textarea>
                            <button onClick={handleSave}>Save</button>
                            &nbsp; &nbsp;
                            <button onClick={handleClose}>Close</button>
                            <br />
                        </main>)
                        : (
                            <main>
                                {
                                    loading ? (<div className="wheel"></div>)
                                        : (
                                            array?.map((e) => {
                                                const { codeInfo, dateAndTime, name,  codeTitle } = e;
                                                return (
                                                    <>
                                                        <main className='firebaseCodes' key={dateAndTime}>
                                                            <br />
                                                            <b>{name}</b>
                                                            <br />
                                                            <br />
                                                            <b>{dateAndTime}</b>
                                                            <br />
                                                            <br />
                                                            <b>File Name : {codeTitle}</b>
                                                            <pre>
                                                                <button className='copyButton' onClick={() => { handleCopy(codeInfo) }}>Copy</button>
                                                                <code className='codeInfo' >{codeInfo}</code>
                                                            </pre>
                                                            <button style={{ fontSize: "13px" }} onClick={() => { handleCodeDelete(dateAndTime) }}>Delete</button>
                                                        </main>
                                                    </>
                                                )
                                            })
                                        )
                                }
                            </main>
                        )
                }

            </main>
        </>
    )
}
