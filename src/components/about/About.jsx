import React from "react";
import { images } from "../constants";

import './about.css';

const About = () => {
    return (
        <section id='about'>
            <h2>Get to know me</h2>
            <div className="container about__container">
                <div className="about__me">
                    <div className="about__me-image">
                        <img src={images.profile} />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default About;
