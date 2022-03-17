import React from 'react';
import { images } from '../constants';
import Resume from '../resume/Resume';

import './header.css';
import HeaderSocials from './HeaderSocials';

const Header = () => {
    return (
        <header>
            <div className='container header__container'>
                <h1>Ravin Bhakta</h1>
                <h5 className='text-light'>FullStack Developer</h5>
                <Resume />
                <HeaderSocials />
                <div className='me'>
                    <img src={images.profile} />
                </div>
            </div>

            <a href="#contact" className='scroll__down'>Scroll Down</a>


        </header>
    );
}

export default Header;