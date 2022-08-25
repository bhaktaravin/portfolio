import React from "react";
import { BsLinkedin } from 'react-icons/bs';
import { AiFillGithub } from 'react-icons/ai';


const HeaderSocials = () => {
    return (
        <div className="header__socials">
            <a href="https://www.linkedin.com/in/ravin-bhakta-543b9264" target="_blank"><BsLinkedin /> </a>
            <a href="http://github.com/bhaktaravin" target="_blank"><AiFillGithub /> </a>
        </div>
    );
}

export default HeaderSocials; 
