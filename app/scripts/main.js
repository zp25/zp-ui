$(() => {
  // carousel
  const carousel = new Carousel('main', { focus: 2, delay: 8000 });
  carousel.autoplay();

  // carousel lite
  const carousellite = new CarouselLite('lite', { focus: 3, delay: 4000 });
  carousellite.autoplay();
});
