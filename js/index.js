const sliderThumbs = new Swiper(".gift__slider_thumbs", {
  spaceBetween: 16,
  slidesPerView: 6,
  freeMode: true,
  // breakpoints: {
  //   768: {
  //     slidesPerView: 5,
  //   },
  //   1024: {
  //     slidesPerView: 6,
  //   },
  // }
});

const sliderCard = new Swiper(".gift__slider_card", {
  spaceBetween: 16,
  speed: 800,
  thumbs: {
    swiper: sliderThumbs,
  },
});
