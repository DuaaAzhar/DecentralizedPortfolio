/* eslint-disable react/prop-types */
import "./Contact.css";
import { useState, useEffect } from "react";
const Contact = ({ state }) => {
  const [resume, setResume] = useState("");

    //To get description from smart contract
    useEffect(()=>{
        const {contract} = state;
        const resumeLink=async()=>{
            const resumeLink = await contract.methods.resumeLink().call();
            setResume(resumeLink);
        }
        contract && resumeLink();
    },[state]);
    return (
        <section className="contact-section">
            <h1 className="title">
                Interested?
                Let's Get In Touch!
            </h1>
            <a href={`https://magenta-alleged-falcon-434.mypinata.cloud/ipfs/QmR9VyCCgdHoJdN6jsBw7QsNFCYwNsrxRbpcSAaGEGPSnD/${resume}`}
             target='_blank' rel="noopener noreferrer">
                <button className="downlodeBTN">
                    View Resume
                </button>
            </a>

        </section>
    )
}

export default Contact;
