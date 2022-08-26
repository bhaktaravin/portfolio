import React from "react";

import './testimonials.css';
import { useState } from "react";
import app from "./firebase";
import {
    Button, Modal, ModalFooter,
    ModalHeader, ModalBody
} from "reactstrap";
import { Input} from 'reactstrap'; 


const Testimonials = () => {
    const [name, setName] = useState(); 
    const[rating, setRating] = useState();
    const [review, setReview] = useState(); 

    const[modal, setModal] = useState(false); 

    const toggle = () => setModal(!modal);




    return (
        <div>
        <section id='testimonials'>
            <h5>Reviews from Previous Employeers</h5>
            <h2>Testimonials</h2>
           <Button color="primary" onClick={toggle}>
                Add Testimonials
           </Button>
           <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle}>Add Testimonial</ModalHeader>
            <ModalBody>
                <Input placeholder="Name..." />
                
                <Input id="txtarea" name="text" type="textarea" />
            </ModalBody>


            <ModalFooter>
          <Button color="primary" onClick={toggle}>
            Add
          </Button>{' '}
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
           </Modal>

           <div className="container testimonials__container">
              <article className="testimonial">
                <h5 className="client__name">Test</h5>
                <small className="client__review">
                  Test
                </small>
              </article>
           </div>
        </section>
        </div>
    );


}

export default Testimonials;
