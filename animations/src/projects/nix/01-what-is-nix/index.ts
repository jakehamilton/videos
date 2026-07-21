import { makeProject } from "@motion-canvas/core";

import intro from "./scenes/01-intro?scene";
import packages from "./scenes/02-packages?scene";
import language from "./scenes/03-language?scene";
import closure from "./scenes/04-closure?scene";
import useCases from "./scenes/05-use-cases?scene";
import install from "./scenes/06-install?scene";

import audio from "./audio.wav";

export default makeProject({
  scenes: [intro, packages, language, closure, useCases, install],
  audio,
});
