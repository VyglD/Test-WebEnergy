import Popup from "./popup";

const init = () => {
  const popup = new Popup(`#popup-feedback`);

  const feedbackButton = document.querySelector(`.prime-header__feedback-button`);

  if (popup.getPopupNode() && feedbackButton) {
    const openFeedbackPopup = popup.getPopupOpenFunction();

    feedbackButton.addEventListener(`click`, () => {
      openFeedbackPopup();
    });
  }
};

export {
  init,
};
