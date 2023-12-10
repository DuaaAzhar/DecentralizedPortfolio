import "./Handles.css";
import { AiFillLinkedin, AiFillTwitterSquare } from "react-icons/ai";
import { FaGithubSquare } from "react-icons/fa";

const Handles = () => {
  return (
    <section className="socials">
      <a
        href="https://www.linkedin.com/in/duaa-azhar-445579209/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <AiFillLinkedin className="icon" />
      </a>
      <a
        href="https://twitter.com/duaa_azhar"
        target="_blank"
        rel="noopener noreferrer"
      >
        <AiFillTwitterSquare className="icon" />
      </a>
      <a
        href="https://github.com/DuaaAzhar"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaGithubSquare className="icon" />
      </a>
    </section>
  );
};

export default Handles;
