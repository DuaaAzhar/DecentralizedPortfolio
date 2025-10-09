/* eslint-disable react/prop-types */
import { SlCalender } from "react-icons/sl";
import "./Experience.css";

const Experience = ({ experiences, educations }) => {
  // Data is now passed as props from App.jsx, no need for contract calls

  return (
    <section id="experience" className="exp-section">
      <h1 className="title">Experience & Education </h1>

      <div className="container">
        <div className="education">
          <h1 className="edu-tittle">Education</h1>
          {educations && educations.length > 0 &&
            educations.map((education, index) => {
              return (
                <div className="edu-card" key={`education-${index}`}>
                  <p className="card-text1">
                    <SlCalender className="icon" /> {education.date}
                  </p>
                  <h3 className="card-text2">{education.degree}</h3>
                  <p className="card-text3">{education.knowledgeAcquired}</p>
                  <p className="card-text4">{education.instutionName}</p>
                </div>
              );
            })}
        </div>
        {/* experience */}
        <div className="education">
          <h1 className="edu-tittle">Experience</h1>
          {experiences && experiences.length > 0 &&
            experiences.map((experience, index) => {
              return (
                <div className="edu-card" key={`experience-${index}`}>
                  <p className="card-text1">
                    <SlCalender className="icon" />
                    {experience.dateRange}
                  </p>
                  <h3 className="card-text2">{experience.designation}</h3>
                  <h3 className="card-text3">
                    {experience.experienceAcquired}
                  </h3>
                  <h3 className="card-text4">{experience.companyName}</h3>
                </div>
              );
            })}
        </div>
      </div>
    </section>
  );
};

export default Experience;
