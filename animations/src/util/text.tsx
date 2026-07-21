import { Txt } from "@motion-canvas/2d";
import {
  Reference,
  Vector2,
  easeInOutSine,
  textLerp,
  tween,
} from "@motion-canvas/core";

export const TITLE_POSITION = new Vector2(80, 80);
export const TITLE_FONT_SIZE = 80;

export function* type<T extends Txt>(
  duration: number,
  node: Reference<T>,
  text: string,
  easing = easeInOutSine,
) {
  yield* tween(duration, (value) => {
    node().text(textLerp(node().text(), text, easing(value)));
  });
}

export function* retype<T extends Txt>(
  duration: number,
  node: Reference<T>,
  text: string,
  easing = easeInOutSine,
) {
  const halfDuration = duration / 2;

  yield* tween(halfDuration, (value) => {
    node().text(textLerp(node().text(), "", easing(value)));
  });

  yield* tween(halfDuration, (value) => {
    node().text(textLerp(node().text(), text, easing(value)));
  });
}
