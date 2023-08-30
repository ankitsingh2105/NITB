import React from 'react';
import footerImg from "./codeNIT.png";
import "./Footer.css"
export default function Footer() {
    return (
        <main className="Footer_main">
            <br />
            <img src={footerImg} alt="" />
            <h3>
                ~ For MCA Students at NIT Bhopal  ~
            </h3>
            <small>Designed and developed by <a href="http://ankitsinghchauhan.tech/">Ankit Singh Chauhan</a></small>
        </main>
    )
}
