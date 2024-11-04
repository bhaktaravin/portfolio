import React, { useEffect, useState } from 'react';
import { Tooltip } from 'reactstrap';
import { images } from '../constants';
import Resume from '../resume/Resume';
import './header.css';
import HeaderSocials from './HeaderSocials';

const Header = () => {
    const [numberFact, setNumberFact] = useState('');
    const [loading, setLoading] = useState(false);
    const [autoUpdate, setAutoUpdate] = useState(true);
    const [showTooltip, setShowTooltip] = useState(false);
    const [factAnimation, setFactAnimation] = useState(''); // New state for fact animation

    const fetchNumberFact = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://numbersapi.com/random?json');
            const data = await response.json();
            setNumberFact(data.text);
            setFactAnimation('fade-in'); // Trigger fade-in animation
            setTimeout(() => setFactAnimation(''), 1000); // Remove animation after 1 second
        } catch (error) {
            console.error('Error fetching number fact:', error);
            alert('Failed to fetch a new fact. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNumberFact(); // Fetch the first fact on mount

        let intervalId;
        if (autoUpdate) {
            intervalId = setInterval(fetchNumberFact, 10000);
        }

        return () => clearInterval(intervalId);
    }, [autoUpdate]);

    return (
        <header>
            <div className='container header__container'>
                <h1>Ravin Bhakta</h1>
                <h5 className='text-light'>FullStack Developer</h5>

                {/* Display fact with fade-in effect */}
                <p className={`number-fact ${factAnimation}`}>
                    {loading ? <div className="spinner"></div> : numberFact}
                </p>

                {/* Random Fact Button */}
                <button
                    className="btn-random"
                    onClick={() => !loading && fetchNumberFact()}
                    disabled={loading}
                    title="Click for a new random fact!"
                >
                    {loading ? 'Loading...' : 'Get Random Fact'}
                </button>

                {/* Tooltip Toggle for Auto-Update */}
                <div className="auto-update-toggle">
                    <label id="autoUpdateToggle">
                        <input
                            type="checkbox"
                            checked={autoUpdate}
                            onChange={() => setAutoUpdate(!autoUpdate)}
                        />
                        Auto Update
                    </label>
                    <Tooltip
                        target="autoUpdateToggle"
                        isOpen={showTooltip}
                        toggle={() => setShowTooltip(!showTooltip)}
                    >
                        Automatically fetches a new fact every 10 seconds
                    </Tooltip>
                </div>

                <Resume />
                <HeaderSocials />
                <div className='me'>
                    <img src={images.profile} alt="Profile" />
                </div>
            </div>

            <a href="#contact" className='scroll__down'>Scroll Down</a>
        </header>
    );
};

export default Header;
