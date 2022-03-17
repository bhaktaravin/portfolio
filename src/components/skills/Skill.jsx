import React from "react";
import './skill.css';
import { images } from "../constants";
const Skill = () => {
    return (
        <section id='skill'>
            <div className="container skills_container">
                <div className="skills_frontend">
                    <h3>Frontend</h3>
                    <div className="skills_content">
                        <article className="skills_details">
                            <div>
                                <img src={images.html5} alt="html5" className="skills_details-icon" />
                            </div>
                        </article>
                        <article className="skills_details">
                            <div>
                                <img src={images.reactjs} alt="reactjs" className="skills_details-icon" />
                            </div>
                        </article>
                    </div>
                </div>

                <div className="skills_backend">
                    <h3>Backend</h3>
                    <div className="skills_content">
                        <article className="skills_details">
                            <div>
                                <img src={images.mongodb} alt="mongodb" className="skills_details-icon" />
                            </div>
                        </article>
                        <article className="skills_details">
                            <div>
                                <img src={images.mysql} alt="mysql" className="skills_details-icon" />
                            </div>
                        </article>
                        <article className="skills_details">
                            <div>
                                <img src={images.spring} alt="spring" className="skills_details-icon" />
                            </div>
                        </article>

                    </div>
                </div>
                <div className="skills_languages">
                    <h3>Programming Languages</h3>
                    <div className="skills_content">
                        <article className="skills_details">
                            <div>
                                <img src={images.java} alt="java" className="skills_details-icon" />
                            </div>
                        </article>
                        <article className="skills_details">

                        </article>
                    </div>
                </div>
                <div className="skills_platforms">
                    <h3>Platforms</h3>
                    <div className="skills_content">
                        <article className="skills_details">
                            <div>
                                <img src={images.sapcloudplatform} alt="sap" className="skills_details-icon" />
                            </div>
                        </article>
                    </div>
                </div>
            </div>


        </section>
    );
}


export default Skill;
