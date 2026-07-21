import { makeProject } from "@motion-canvas/core";

import intro from "./scenes/01-intro?scene";
import channels from "./scenes/02-channels?scene";
import lock from "./scenes/03-lock?scene";
import sharing from "./scenes/04-sharing?scene";
import starting from "./scenes/05-getting-started?scene";
import init from "./scenes/06-init?scene";
import flake from "./scenes/07-flake?scene";
import outputs from "./scenes/08-outputs?scene";
import commands from "./scenes/09-commands?scene";

import audio from "./audio.wav";

export default makeProject({
  scenes: [
    intro,
    channels,
    lock,
    sharing,
    starting,
    init,
    flake,
    outputs,
    commands,
  ],
  audio,
});
