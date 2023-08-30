import React from 'react'
import "./Services.css"
import logo from "./Manit_logo.png"
export default function Services(props) {
  return (
    <main id={props.id} className="Services_main">

      <h1>Services</h1>
      <img src={logo} />
      <br />
      <section>
        <ol>
          <li>Secure Code Storage: Safely store your code snippets in our cloud-based repository. Your code is encrypted and accessible only to you.</li>
          <li>Effortless Retrieval: Easily retrieve your saved code snippets whenever you need them. No more worrying about lost code or overwritten files.</li>
          <li>Code Organization: Categorize and label your code snippets for efficient management. Keep your coding resources organized and easily searchable.</li>
          <li>Cross-Device Access: Access your stored code snippets from any device with an internet connection. Your code is always at your fingertips, whether at home or on the go.</li>
          <li>Collaborative Sharing: Share code snippets with your peers and collaborate on projects seamlessly. Enhance teamwork and learning within the NIT Bhopal coding community.</li>
          <li>User-Friendly Interface: Enjoy a user-friendly interface designed for NIT Bhopal students. Our platform is intuitive and tailored to meet your coding needs.</li>
          <li>CodeScribe Community: Become a part of the CodeScribe NITB community. Connect with fellow students, share insights, and elevate your coding skills together.</li>
          <li>Privacy and Security: Rest assured knowing that your code and data are protected with advanced security measures. Your information is kept confidential at all times.</li>
        </ol>
        <p><b>Experience the convenience and benefits of CodeScribe NITB's services today!</b></p>
      </section>
    <br /><br />
    </main>
  )
}
