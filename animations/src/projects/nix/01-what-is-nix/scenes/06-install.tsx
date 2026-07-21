import { Circle, Icon, Img, makeScene2D, Rect } from "@motion-canvas/2d";
import {
  Vector2,
  all,
  createRef,
  debug,
  waitFor,
  waitUntil,
  delay,
  tween,
  textLerp,
  createSignal,
  linear,
  easeInOutCubic,
  easeInOutSine,
  slideTransition,
  Direction,
  Reference,
  easeOutElastic,
} from "@motion-canvas/core";
import { insert } from "@motion-canvas/2d/lib/components/CodeBlock";
import { Txt } from "~/components/txt";
import * as colors from "~/util/colors";
import { swoop, swoopTitle } from "~/util/transform";
import { CONTENT_GAP, TITLE_FONT_SIZE, TITLE_POSITION } from "./01-intro";
import firefoxImage from "../assets/firefox.png";
import { retype } from "~/util/text";

const Feature = <T extends Rect>({
  children,
  ref,
}: {
  children: string;
  ref: Reference<T>;
}) => {
  return (
    <Rect
      ref={ref}
      alignItems="center"
      justifyContent="center"
      padding={32}
      radius={32}
      fill={colors.raised.background}
      grow={1}
      opacity={0}
    >
      <Txt bold>{children}</Txt>
    </Rect>
  );
};

export default makeScene2D(function* (view) {
  view.fill(colors.root.background);

  const title = createRef<Txt>();

  view.add(
    <Txt ref={title} bold fontSize={64}>
      Excited?
    </Txt>,
  );

  yield* slideTransition(Direction.Bottom, 1);

  yield* waitUntil("nix_install_excited");

  yield* retype(1, title, "Great!");

  yield* waitUntil("nix_install_start");

  yield* retype(1, title, "Install");

  yield* swoopTitle(title);

  yield* waitUntil("nix_install_detsys");

  const detsys = createRef<Txt>();

  view.add(<Txt ref={detsys} bold fontSize={64}></Txt>);

  yield* tween(2, (value) => {
    detsys().text(textLerp("", "determinate.systems", easeInOutSine(value)));
  });

  yield* waitUntil("nix_install_detsys_link");

  yield* retype(3, detsys, "install.determinate.systems");

  const farewell = createRef<Txt>();

  view.add(
    <Txt
      ref={farewell}
      bold
      fill={colors.primary}
      position={new Vector2(0, 600)}
    >
      Happy Nixing!
    </Txt>,
  );

  yield* waitUntil("nix_install_farewell");

  yield* farewell().position.y(260, 1, easeOutElastic);

  yield* waitFor(2);
});
