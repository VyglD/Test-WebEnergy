import {init as initBlank} from "./modules/blank";
import {init as initFeedback} from "./modules/feedback";
import {init as initSlider} from "./modules/slider";
import {init as initCategories} from "./modules/catalog-categories";
import {setAbilitySpaceAction} from "./modules/utils";

document.querySelectorAll(`a`).forEach((node) => {
  setAbilitySpaceAction(node);
});

initBlank();
initFeedback();
initSlider();
initCategories();
