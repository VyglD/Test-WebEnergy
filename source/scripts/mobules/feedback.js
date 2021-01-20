import Popup from "./popup";
import {getCustomToastr} from "./utils";

const INVALID_CLASS = `feedback__input--invalid`;

const ErrorMessage = {
  REQUIRED: `Поле обязательно для заполнения`,
  EMAIL: `Email указан неверно`,
  PHONE: `Телефон указан неверно`
};

const toastr = getCustomToastr();

const validateEmail = (email) => {
  const template = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/u;
  return template.test(String(email).toLowerCase());
};

const validatePhone = (phone) => {
  const template = /^((8|([\+]?7))([\-]| )?)?([\(]?[0-9]{3}[\)]?([\-]| )?)([0-9]|[\-]| ){7,10}$/u;
  return template.test(String(phone).toLowerCase());
};

const checkInput = (input) => {
  if (input.value.length === 0) {
    input.errorMessage = ErrorMessage.REQUIRED;
    input.placeholder = ErrorMessage.REQUIRED;

    return false;
  }

  input.placeholder = ``;
  return true;
};

const checkEmailInput = (input) => {
  if (checkInput(input)) {
    if (validateEmail(input.value)) {
      return true;
    }

    input.errorMessage = ErrorMessage.EMAIL;
    return false;
  }

  return false;
};

const checkPhoneInput = (input) => {
  if (checkInput(input)) {
    if (validatePhone(input.value)) {
      return true;
    }

    input.errorMessage = ErrorMessage.PHONE;
    return false;
  }

  return false;
};

const setCheckFunction = (input, checkFunction) => {
  if (input) {
    input.checkValue = checkFunction.bind(null, input);
    input.errorMessage = ``;
  }
};

const setValidStatusToInput = (input) => {
  if (input.classList.contains(INVALID_CLASS)) {
    input.classList.remove(INVALID_CLASS);
    input.setCustomValidity = ``;
  }
};

const init = () => {
  const popup = new Popup(`#popup-feedback`);

  const openFeedbackPopup = popup.getPopupOpenFunction();
  const closeFeedbackPopup = popup.getPopupCloseFunction();

  const feedbackButton = document.querySelector(`.prime-header__feedback-button`);
  const popupNode = popup.getPopupNode();

  if (popupNode && feedbackButton) {
    const inputs = Array.from(popupNode.querySelectorAll(`input[required]`));
    const emailInput = inputs.find((node) => node.id === `feedback-email`);
    const phoneInput = inputs.find((node) => node.id === `feedback-phone`);
    const submitButton = popupNode.querySelector(`.feedback__submit`);

    inputs.forEach((input) => setCheckFunction(input, checkInput));
    setCheckFunction(emailInput, checkEmailInput);
    setCheckFunction(phoneInput, checkPhoneInput);

    inputs.forEach((input) => {
      input.addEventListener(`input`, () => {
        if (input.checkValue()) {
          setValidStatusToInput(input);
        } else {
          input.placeholder = ``;
        }
      });
    });

    feedbackButton.addEventListener(`click`, () => {
      openFeedbackPopup();
    });

    submitButton.addEventListener(`click`, (evt) => {
      evt.preventDefault();

      let isFormValid = true;
      for (let i = 0; i < inputs.length; i++) {

        if (inputs[i].checkValue()) {
          setValidStatusToInput(inputs[i]);
        } else {
          inputs[i].classList.add(INVALID_CLASS);

          if (isFormValid) {
            inputs[i].focus();

            toastr.error(inputs[i].errorMessage);
            isFormValid = false;
          }
        }
      }

      if (isFormValid) {
        toastr.success(`Мы свяжемся с вами в ближайшее время.`);

        inputs.forEach((input) => {
          input.value = ``;
        });

        closeFeedbackPopup();
      }
    });
  }
};

export {
  init,
};
