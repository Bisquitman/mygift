try {
  const sliderThumbs = new Swiper(".gift__slider_thumbs", {
    spaceBetween: 12,
    slidesPerView: 4,
    freeMode: true,
    scrollbar: {
      el: ".swiper-scrollbar",
      hide: false,
      draggable: true,
    },
    breakpoints: {
      320: {
        spaceBetween: 12,
        slidesPerView: 4,
      },
      768: {
        spaceBetween: 12,
        slidesPerView: 5,
      },
      1024: {
        spaceBetween: 16,
        slidesPerView: 6,
      },
    },
  });

  const sliderCard = new Swiper(".gift__slider_card", {
    spaceBetween: 16,
    speed: 800,
    thumbs: {
      swiper: sliderThumbs,
    },
  });
} catch (error) {
  console.log("На этой странице нет слайдеров");
}

try {
  const card = document.querySelector(".card");
  const cardInner = document.querySelector(".card__inner");

  card.addEventListener("click", (e) => {
    console.log("rotate");
    cardInner.classList.toggle("_rotate");
  });
} catch (error) {
  console.log("На этой странице нет отурыток");
}
