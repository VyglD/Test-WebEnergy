import {init as initBlank} from "./mobules/blank";
import {init as initFeedback} from "./mobules/feedback";
import {init as initSlider} from "./mobules/slider";
import {setAbilitySpaceAction} from "./mobules/utils";

document.querySelectorAll(`a`).forEach((node) => {
  setAbilitySpaceAction(node);
});

initBlank();
initFeedback();
initSlider();
