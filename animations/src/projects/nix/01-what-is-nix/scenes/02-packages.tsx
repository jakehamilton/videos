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
} from "@motion-canvas/core";
import { insert } from "@motion-canvas/2d/lib/components/CodeBlock";
import { Txt } from "~/components/txt";
import * as colors from "~/util/colors";
import { swoop, swoopTitle } from "~/util/transform";
import { TITLE_FONT_SIZE, TITLE_POSITION } from "./01-intro";
import firefoxImage from "../assets/firefox.png";

export default makeScene2D(function* (view) {
  view.fill(colors.root.background);

  const title = createRef<Txt>();

  view.add(
    <Txt ref={title} bold fontSize={64}>
      Packages
    </Txt>,
  );

  yield* slideTransition(Direction.Bottom, 1);

  yield* waitFor(1);

  yield* swoopTitle(title);

  const firefox = createRef<Img>();

  view.add(<Img ref={firefox} src={firefoxImage} opacity={0} />);

  yield* waitUntil("nix_packages_firefox");

  yield* firefox().opacity(1, 1);

  const openssl = createRef<Icon>();

  view.add(
    <Icon
      ref={openssl}
      icon="material-symbols:deployed-code"
      size={256}
      position={new Vector2(256, 0)}
      opacity={0}
    />,
  );

  yield* waitUntil("nix_packages_openssl");

  yield* all(firefox().position.x(-256, 1), delay(1, openssl().opacity(1, 1)));

  yield* waitFor(2);
});
