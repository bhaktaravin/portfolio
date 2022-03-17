import React, { useRef } from "react";

import './contact.css';
import emailjs from '@emailjs/browser';
import { MdOutlineEmail } from 'react-icons/md';
import { BsDiscord } from 'react-icons/bs';


const Contact = () => {
    const form = useRef();

    const handleSubmit = (e) => {
        e.preventDefault();

        emailjs.sendForm('service_w8c3wrr', 'template_c0xfi54', form.current, 'Y-0DZ0nj7VobA14wb')
            .then((result) => {
                console.log(result.text);
            }, (error) => {
                console.log(error.text);
            });

        e.target.reset();
    };

    return (
        <section id='contact'>
            <h2>Contact Me</h2>
            <div className="container contact__container" >
                <div className="contact__options">
                    <article className="contact__option">
                        <MdOutlineEmail className="contact__option-icon" />
                        <h4>Email</h4>
                        <h5>ravin.bhakta@gmail.com</h5>
                        <a href="mailto:ravin.bhakta@gmail.com">Send a message</a>
                    </article>
                    <article className="contact__option">
                        <BsDiscord className="contact__option-icon" />
                        <h4>Discord Tag: </h4>
                        <h4>bhaktaravin#9236</h4>
                    </article>


                </div>

                <form ref={form} onSubmit={handleSubmit}>
                    <input type="text" name='from_name' placeholder="Full Name" required />
                    <input type="text" name="email" placeholder="Email" required />
                    <input type="text" name="subject" placeholder="Subject..." required />
                    <textarea name="message" rows="7" placeholder="Message..." required />
                    <button type='submit' className="btn btn-primary">Send Message</button>
                </form>

            </div>

        </section >
    );
}

export default Contact;
