import {getCustomToastr} from "./utils";

const toastr = getCustomToastr();

const showInfoMessage = (evt) => {
  evt.preventDefault();

  toastr.info(`Данный функционал отсуствует`);
};

const init = () => {
  const blankNodes = document.querySelectorAll(`[data-blank-status]`);

  blankNodes.forEach((node) => {
    node.addEventListener(`click`, showInfoMessage);
  });
};

export {
  init,
};
