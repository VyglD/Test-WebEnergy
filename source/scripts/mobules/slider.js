import $ from "jquery";
import "slick-carousel";

const getToggleButtonTemplate = (customClass, ariaLabel) => {
  return (`
    <button
      class="slider__toogle-button ${customClass}"
      type="button"
      aria-label="${ariaLabel}"
    >
    </button>
  `);
};

const init = () => {
  $(`.slider__content`).slick({
    autoplay: true,
    autoplaySpeed: 4000,
    cssEase: `ease-out`,
    fade: true,
    nextArrow: getToggleButtonTemplate(`slider__toogle-button--next`, `Следующий слайд`),
    pauseOnFocus: false,
    pauseOnHover: false,
    prevArrow: getToggleButtonTemplate(`slider__toogle-button--prev`, `Предыдущий слайд`),
    slidesToShow: 1,
    slidesToScroll: 1,
  });
};

export {
  init,
};
