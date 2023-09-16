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
    const editRef = useRef();
    const displayEditWindow = useRef();

    const [changedValue, setchangedValue] = useState("");
    const [viewEditor, setviewEditor] = useState(false);
    const [nameofLang, setnameofLang] = useState("");
    const [array, setarray] = useState([]);
    const [loading, setloading] = useState(true);
    const [obj, setobj] = useState("");

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
        if (codeData.current.value === "") {
            toast.error("Please enter some code")
            return;
        }
        let obj = {
            "name": nameofLang,
            "codeInfo": codeData.current.value || "No Code",
            "dateAndTime": getCurrentTimeAndDay(),
            "codeTitle": codeTitle.current.value || "No title"
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
            toast.success("Code Copied to clipboard", { autoClose: 1700 });
        }
        catch (error) {
            console.error('Error copying to clipboard:', error);
        }
    }

    const handleEdits = (dateAndTime, codeInfo, name, codeTitle) => {
        setobj((e) => ({
            date: dateAndTime,
            code: codeInfo,
            name: name,
            title: codeTitle
        }))
        displayEditWindow.current.style.display = "block";
        editRef.current.value = codeInfo;
    }

    const handleEditSave = async (date, code) => {
        const updatedArray = array.map((e) => {
            if (e.dateAndTime === date) {
                if (changedValue !== "") {
                    return { ...e, codeInfo: changedValue };
                }
            }
            return e;
        });
        console.log("updated:\n", updatedArray);
        setarray(updatedArray);
        console.log("this is the updated array -> ", updatedArray);

        let user = auth.currentUser;
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        const info = docSnap.data();

        setDoc(docRef, {
            ...info,
            arrayOfObject: updatedArray,
        });
        displayEditWindow.current.style.display = "none";
    }


    const handleEditClose = () => {
        displayEditWindow.current.style.display = "none";
    }

    const handleChanges = (e) => {
        setchangedValue(e.target.value);
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
                        <img style={{ margin: "0px" }} onClick={() => { window.location.href = "/" }} src={logo} alt="logo image" />
                    </ul>
                </nav>
                <section className='SecondSection' >
                    <h3>~Welcome <b style={{ color: "#ff2d2d" }} >{user?.displayName}</b> ~</h3>
                    <h2>~Select programming language~</h2>
                    <ul className='proGrammingLangs'>
                        <li style={{background :"red"}} onClick={() => { proLang("HTML") }} ><i style={{ color: "white" }} class="fa-brands fa-html5"></i></li>
                        <li style={{background :"blue"}} onClick={() => { proLang("CSS") }} ><i style={{ color: "white" }} class="fa-brands fa-css3-alt"></i></li>
                        <li style={{background :"yellow"}} onClick={() => { proLang("Javascript") }} ><i style={{ color: "yellow", background: "black" }} class="fa-brands fa-js"></i></li>
                        <li style={{background :"blue"}} onClick={() => { proLang("Python") }} ><i style={{ color: "yellow" }} className="fa-brands fa-python"></i></li>
                        <li style={{ color: "blue" }} onClick={() => { proLang("C") }} ><small>C</small></li>
                        <li style={{background :"#1abdff"}} onClick={() => { proLang("Reactjs") }} ><i style={{ color: "white" }} class="fa-brands fa-react"></i></li>
                        <li style={{background :"orange"}} onClick={() => { proLang("Java") }} ><i style={{ color: "white" }} class="fa-brands fa-java"></i></li>
                        <li style={{background :"purple"}} onClick={() => { proLang("PHP") }} ><i style={{ color: "white" }} className="fa-brands fa-php"></i></li>
                        <li style={{background :"gray"}} onClick={() => { proLang("Rust") }} ><i style={{ color: "white" }} className="fa-brands fa-rust"></i></li>
                        <li style={{background :"green"}} onClick={() => { proLang("Vue.js") }} ><i style={{ color: "white" }} className="fa-brands fa-vuejs"></i></li>
                        <li style={{background :"red"}} onClick={() => { proLang("Angular") }} ><i style={{ color: "white" }} className="fa-brands fa-angular"></i></li>
                        <li style={{ color: "blue" }} onClick={() => { proLang("C++") }} > <small>C++</small></li>
                    </ul>
                </section>
                {
                    viewEditor ?
                        (<main style={{ marginTop: "4rem" }} className='in_codes'>
                            <h3>{nameofLang}</h3>
                            <h3>{dayandData}</h3>
                            <br />
                            <input placeholder='Enter File Name' ref={codeTitle} type="text" />
                            <textarea className='CodeTextArea' ref={codeData} placeholder="Enter you code here" cols="100" rows="20"></textarea>
                            <br />
                            <section>
                                <button onClick={handleSave}>Save</button>
                                &nbsp; &nbsp;
                                <button onClick={handleClose}>Close</button>
                            </section>
                            <br />
                        </main>)
                        : (
                            <main>
                                {
                                    loading ? (<div className="wheel"></div>)
                                        : (
                                            array?.map((e) => {
                                                const { codeInfo, dateAndTime, name, codeTitle } = e;
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
                                                            <section>
                                                            <button onClick={() => { handleCodeDelete(dateAndTime) }}>Delete</button>
                                                            &nbsp; &nbsp;
                                                            <button onClick={() => { handleEdits(dateAndTime, codeInfo, name, codeTitle) }} >Edit</button>
                                                            </section>
                                                            <br />
                                                        </main>
                                                    </>
                                                )
                                            })
                                        )
                                }
                            </main>
                        )
                }
                <main style={{ marginTop: "3.3rem", display: "none" }} ref={displayEditWindow} className='in_codes'>
                    <h3>{obj.name}</h3>
                    <h4>{obj.date}</h4>
                    <b>{obj.title}</b>
                    <textarea className='CodeTextArea' onChange={handleChanges} ref={editRef} cols="90" rows="23"></textarea>
                    <button onClick={() => { handleEditSave(obj.date, obj.code) }}>Save</button>
                    &nbsp; &nbsp;
                    <button onClick={handleEditClose}>Close</button>
                    <br />
                </main>

            </main>
        </>
    )
}
