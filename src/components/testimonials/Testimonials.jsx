import { collection, deleteDoc, doc, getDocs, setDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import { Button, Input, Modal, ModalBody, ModalFooter, ModalHeader, Tooltip } from "reactstrap";
import { db } from "./firebase";
import './testimonials.css';

const Testimonials = () => {
  const [name, setName] = useState('');
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);
  const [modal, setModal] = useState(false);
  const [lst, setLst] = useState([]);
  const [tooltipOpen, setTooltipOpen] = useState({}); // State for tooltip open status
  const reviewsCollectionRef = collection(db, "reviews");

  const toggle = () => setModal(!modal);

  const onSubmit = async (e) => {
    e.preventDefault();
    const data = { name, review, rating };

    console.log(data);

    await setDoc(doc(db, "reviews", data.name), data);

    // Reset form fields
    setName('');
    setReview('');
    setRating(0);

    // Close modal
    toggle();

    // Refresh testimonials list to reflect the new entry
    getReviews();
  };

  const deleteReview = async (id) => {
    const userDoc = doc(db, "reviews", id);
    await deleteDoc(userDoc);
    getReviews();
  };

  const getReviews = async () => {
    const data = await getDocs(reviewsCollectionRef);
    setLst(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  useEffect(() => {
    getReviews();
  }, [getReviews]);

  // Toggle tooltip for a specific testimonial item by ID
  const toggleTooltip = (id) => {
    setTooltipOpen((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      if (i < Math.floor(rating)) {
        stars.push(<FaStar key={i} size={24} color="#ffc107" />);
      } else if (i < rating) {
        stars.push(<FaStarHalfAlt key={i} size={24} color="#ffc107" />);
      } else {
        stars.push(<FaStar key={i} size={24} color="#dcdcdc" />);
      }
    }
    return stars;
  };

  return (
    <section id='testimonials'>
      <h5>Reviews from Previous Employers</h5>
      <h2>Testimonials</h2>
      <center>
        <Button color="primary" onClick={toggle}>Add Testimonials</Button>
      </center>
      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Add Testimonial</ModalHeader>
        <ModalBody>
  <h5>Rating:</h5>
  <div className="slider-rating mb-3">
    <input
      type="range"
      min="0"
      max="5"
      step="0.5"
      value={rating}
      onChange={(e) => setRating(parseFloat(e.target.value))}
      style={{ width: "100%", marginBottom: "10px" }}
    />
    <Input
      type="number"
      min="0"
      max="5"
      step="0.5"
      value={rating}
      onChange={(e) => setRating(parseFloat(e.target.value))}
      placeholder="Rating (0-5)"
      className="mb-3"
    />
  </div>

  <Input
    id="name"
    onChange={(e) => setName(e.target.value)}
    value={name}
    placeholder="Name..."
    className="mb-3"
  />
  <Input
    id="review"
    onChange={(e) => setReview(e.target.value)}
    value={review}
    type="textarea"
    placeholder="Review..."
    className="mb-3"
  />
</ModalBody>

        <ModalFooter>
          <Button color="primary" onClick={onSubmit}>Add</Button>{' '}
          <Button color="secondary" onClick={toggle}>Cancel</Button>
        </ModalFooter>
      </Modal>
      <br /><br />
      <div className="container testimonials__container">
        {lst.map((item) => (
          <article key={item.id} className="testimonial">
            <div
              id={`stars-${item.id}`}
              className="stars"
              onMouseEnter={() => toggleTooltip(item.id)}
              onMouseLeave={() => toggleTooltip(item.id)}
            >
              {renderStars(item.rating)}
              <Tooltip
                placement="top"
                isOpen={tooltipOpen[item.id] || false}
                target={`stars-${item.id}`}
                toggle={() => toggleTooltip(item.id)}
              >
                {`Rated ${item.rating} by ${item.name}`}
              </Tooltip>
            </div>
            <h2 className="client__name">{item.name}</h2>
            <small
              id={`review-${item.id}`}
              onMouseEnter={() => toggleTooltip(item.id)}
              onMouseLeave={() => toggleTooltip(item.id)}
            >
              {item.review}
            </small>
            <Tooltip
              placement="top"
              isOpen={tooltipOpen[item.id] || false}
              target={`review-${item.id}`}
              toggle={() => toggleTooltip(item.id)}
            >
              {`Rated ${item.rating} by ${item.name}`}
            </Tooltip>
            <Button color="secondary" onClick={() => deleteReview(item.id)}>Delete</Button>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
