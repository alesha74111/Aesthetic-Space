const swiper = new Swiper('.projects__slider', {
  effect: "fade",
  fadeEffect: {
    crossFade: true
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },

});

const gallerySwiper = new Swiper('.gallery__swiper', {
  slidesPerView: 'auto', 
  effect: "cards",
  grabCursor: true,
  pagination: {
  el: '.swiper-pagination',
  clickable: true,
},
});
