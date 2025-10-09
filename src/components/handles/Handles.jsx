import "./Handles.css";
import { AiFillLinkedin, AiFillTwitterSquare } from "react-icons/ai";
import { FaGithubSquare } from "react-icons/fa";

const Handles = ({ personalInfo }) => {
  // Parse social links from personalInfo.socialLinks array
  const getSocialLink = (platform) => {
    if (!personalInfo?.socialLinks) return null;
    return personalInfo.socialLinks.find(link => 
      link.toLowerCase().includes(platform.toLowerCase())
    );
  };

  return (
    <section className="socials">
      {getSocialLink('linkedin') && (
        <a
          href={getSocialLink('linkedin')}
          target="_blank"
          rel="noopener noreferrer"
        >
          <AiFillLinkedin className="icon" />
        </a>
      )}
      {getSocialLink('twitter') && (
        <a
          href={getSocialLink('twitter')}
          target="_blank"
          rel="noopener noreferrer"
        >
          <AiFillTwitterSquare className="icon" />
        </a>
      )}
      {getSocialLink('github') && (
        <a
          href={getSocialLink('github')}
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaGithubSquare className="icon" />
        </a>
      )}
    </section>
  );
};

export default Handles;
