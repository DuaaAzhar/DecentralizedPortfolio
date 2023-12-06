import { SlCalender } from "react-icons/sl"
import './Experience.css'
import { useEffect, useState } from "react"

const Experience = ({state}) => {
    const [experiences, setExperience]= useState("");
    const [educations, setEducation]= useState("");

    // to get experiences from smart contract
    useEffect(()=>{
       const {contract}= state;
       const experiences= async()=>{
        const contractExperience = await contract.methods.allExperience().call();
        setExperience(contractExperience);
        console.log(experiences);
       }
       contract && experiences();
    },[state])
    
    // to get education from smart contract
    useEffect(()=>{
        const {contract}= state;
        const educationDetails= async()=>{
         const contractEducation = await contract.methods.allEducation().call();
         setEducation(contractEducation);
        }
        contract && educationDetails();
     },[state])

    return (
        <section className="exp-section">
            <h1 className="title">Experience & Education </h1>

            <div className="container">
                <div className="education">
                    <h1 className="edu-tittle">Education</h1>
                    {
                        educations!=="" && educations.map((education)=>{
                            return (   
                            <div className="edu-card">
                            <p className="card-text1">
                                <SlCalender className='icon' /> {education.date}
                            </p>
                            <h3 className="card-text2">{education.degree}</h3>
                            <p className="card-text3">{education.knowledgeAcquired}</p>
                            <p className="card-text4">
                            {education.instutionName}
                            </p>
                        </div>)
                        })
                    }
                </div>
                {/* experience */}
                <div className="education">
                    <h1 className="edu-tittle">Experience</h1>
                    {
                        experiences!="" && experiences.map((experience)=>{
                            return(
                                <div className="edu-card">
                                    <p className="card-text1">
                                        <SlCalender className="icon"/>
                                        {experience.dateRange}
                                    </p>
                                    <h3 className="card-text2">{experience.designation}</h3>
                                    <h3 className="card-text3">{experience.experienceAcquired}</h3>
                                    <h3 className="card-text4">{experience.companyName}</h3>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </section>
    )
}

export default Experience
