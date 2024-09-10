const myCarouselElement = document.querySelector('#myCarousel');
const todayFeaturedCarouselElement = document.querySelector('#todayFeatured');

new bootstrap.Carousel(myCarouselElement, {
    interval: 5000,
    keyboard: false,
    pause: false,
    ride: "carousel"
});

new bootstrap.Carousel(todayFeaturedCarouselElement, {
    interval: 5000,
    keyboard: false,
    pause: false,
    ride: "carousel"
});
