import React from "react";
import resume from '../../assests/RavinBhaktaResume.pdf';


const Resume = () => {
    return (
        <div className='resume'>
            <a href={resume} download className="btn">Download Resume</a>
            <a href="#contact" className="btn btn-primary">Lets talk</a>

        </div>
    )
}


export default Resume;
