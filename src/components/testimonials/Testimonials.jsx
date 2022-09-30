import React from "react";

import './testimonials.css';
import { useState } from "react";
import {db} from "./firebase";
import {
    Button, Modal, ModalFooter,
    ModalHeader, ModalBody
} from "reactstrap";
import { Input} from 'reactstrap'; 
import { setDoc, doc, collection, getDocs, deleteDoc } from "firebase/firestore";
import { useEffect } from "react";
const Testimonials = () => {
   
    const [name, setName] = useState(''); 
    const[review, setReview] = useState('');
    const[modal, setModal]  = useState(false); 
    const [lst, setLst] = useState([]);
    const reviewsCollectionRef = collection(db, "reviews");


    const toggle = () => setModal(!modal);

    const onSubmit = async(e) => {
      e.preventDefault(); 
      const data= {
        name: name, 
        review: review
      }

      console.log(data);

      
      await setDoc(doc(db, "reviews", data.name),{
        name: data.name, 
        review: data.review
      });
    }
    
    const deleteReview = async (id) => {
      const userDoc = doc(db, "reviews", id);
      await deleteDoc(userDoc);
    };
   
    useEffect(() => {
      const getReviews = async() => {
        const data =await getDocs(reviewsCollectionRef); 
        setLst(data.docs.map((doc) => ({...doc.data(), id: doc.id})));
      };

      getReviews();
    }, []);

    return (
        
        <section id='testimonials'>
            <h5>Reviews from Previous Employeers</h5>
            <h2>Testimonials</h2>
            <center>
           <Button color="primary" onClick={toggle}>
                Add Testimonials
           </Button>
           </center>
           <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle}>Add Testimonial</ModalHeader>
            <ModalBody>
                <Input id="name"  onChange = {(e) => setName(e.target.value)} value = {name} placeholder="Name..." />
                
                <Input id="review" onChange = {(e) => setReview(e.target.value)} value={review} type="textarea" />
                
            </ModalBody>


            <ModalFooter>

          <Button color="primary" onClick={onSubmit}>
            Add
          </Button>{' '}
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
           </Modal>
           < br />
           <br />
           <div className="container testimonials__container" >
           {lst.map((item) => {
              return (
                <article key={item} className="testimonial">
                    <h2 className="client__name">{item.name}</h2>

                    <small>{item.review}</small><br />

                    <Button color="secondary" onClick={() => {
                      deleteReview(item.id);
                    }}>

                      Delete
                    </Button>
                </article>
              );
            })}
     
          
        </div>
  



          
        </section>
      
    );
}


export default Testimonials;
