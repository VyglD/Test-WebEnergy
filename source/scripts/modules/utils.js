import {Key} from "./constants";
import toastr from "toastr";

const getNextArrayIndex = (currentIndex, arr) => {
  return (currentIndex + 1) % arr.length;
};

const getPreviousArrayIndex = (currentIndex, arr) => {
  return (currentIndex + (arr.length - 1)) % arr.length;
};

const isEscKeyDown = (evt) => {
  return evt.key === Key.ESC;
};

const isSpaceKeyDown = (evt) => {
  return evt.key === Key.SPACE;
};

const setAbilitySpaceAction = (node) => {
  node.addEventListener(`keydown`, (evt) => {
    if (isSpaceKeyDown(evt)) {
      evt.preventDefault();
    }
  });

  node.addEventListener(`keyup`, (evt) => {
    if (isSpaceKeyDown(evt)) {
      node.dispatchEvent(new Event(`click`));
    }
  });
};

const getCustomToastr = () => {
  toastr.options = {
    closeButton: true,
    debug: false,
    newestOnTop: true,
    progressBar: true,
    positionClass: `toast-top-left`,
    preventDuplicates: false,
    onclick: null,
    showDuration: 300,
    hideDuration: 1000,
    timeOut: 5000,
    extendedTimeOut: 1000,
    showEasing: `swing`,
    hideEasing: `linear`,
    showMethod: `fadeIn`,
    hideMethod: `fadeOut`
  };

  return toastr;
};

export {
  getNextArrayIndex,
  getPreviousArrayIndex,
  isEscKeyDown,
  isSpaceKeyDown,
  setAbilitySpaceAction,
  getCustomToastr,
};
