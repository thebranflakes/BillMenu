import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../css/BagelCarousel.css';

// Dynamically load all bagel images
const importAll = (r) => r.keys().map(r);
const images = importAll(require.context('../assets/bagels', false, /\.(png|jpe?g|svg)$/));

const BagelCarousel = () => {
    const settings = {
        dots: false, // Remove dots
        infinite: true, // Enables continuous rotation
        speed: 2000, // Adjust speed for smooth scrolling
        slidesToShow: 3, // Show 3 images at once
        slidesToScroll: 1, // Scroll one image at a time
        autoplay: true, // Auto-slide enabled
        autoplaySpeed: 2500, // Time before sliding to next image
        arrows: false, // Hide arrows for a cleaner look
        pauseOnHover: false, // Keep it moving even when hovered
        centerMode: false, // Centers active images
        variableWidth: false, // Ensures consistent sizing
      };
      

  return (
    <div className="carousel-container">
      <Slider {...settings}>
        {images.map((image, index) => (
          <div key={index} className="carousel-slide">
            <img src={image} alt={`Bagel ${index + 1}`} className="carousel-image" />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default BagelCarousel;
