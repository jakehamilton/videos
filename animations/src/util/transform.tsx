import { Layout, Line, Txt } from "@motion-canvas/2d";
import { all, delay, Reference, Vector2 } from "@motion-canvas/core";
import { TITLE_FONT_SIZE, TITLE_POSITION } from "./text";

export function* swoop<T extends Layout>(
  node: Reference<T>,
  {
    x,
    y,
    xSpeed = 0.75,
    ySpeed = 0.75,
    delayTime = 0.15,
  }: {
    x: number;
    y: number;
    xSpeed?: number;
    ySpeed?: number;
    delayTime?: number;
  },
) {
  yield* all(
    node().position.x(x, xSpeed),
    delay(delayTime, node().position.y(y, ySpeed)),
  );
}

export function* swoopTitle<T extends Txt>(node: Reference<T>) {
  const initialFontSize = node().fontSize();
  yield* node().fontSize(TITLE_FONT_SIZE, 0);
  const titleSize = node().size();
  yield* node().fontSize(initialFontSize, 0);

  const titlePosition = TITLE_POSITION.transformAsPoint(
    node().worldToLocal(),
  ).add(titleSize.div(2));

  yield* all(
    node().position.x(titlePosition.x, 1),
    delay(0.15, node().position.y(titlePosition.y, 1)),
    node().fontSize(TITLE_FONT_SIZE, 1),
  );
}
