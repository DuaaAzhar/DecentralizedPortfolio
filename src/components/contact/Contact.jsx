/* eslint-disable react/prop-types */
import "./Contact.css";

const Contact = ({ personalInfo }) => {
    return (
        <section id="contact" className="contact-section">
            <h1 className="title">
                Interested?
                Let's Get In Touch!
            </h1>
            {personalInfo?.resumeLink && (
                <a href={personalInfo.resumeLink}
                 target='_blank' rel="noopener noreferrer">
                    <button className="downlodeBTN">
                        View Resume
                    </button>
                </a>
            )}
        </section>
    )
}

export default Contact;
