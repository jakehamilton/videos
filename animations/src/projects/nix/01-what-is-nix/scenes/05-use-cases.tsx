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
} from "@motion-canvas/core";
import { insert } from "@motion-canvas/2d/lib/components/CodeBlock";
import { Txt } from "~/components/txt";
import * as colors from "~/util/colors";
import { swoop, swoopTitle } from "~/util/transform";
import { CONTENT_GAP, TITLE_FONT_SIZE, TITLE_POSITION } from "./01-intro";
import firefoxImage from "../assets/firefox.png";

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
      Features
    </Txt>,
  );

  yield* slideTransition(Direction.Bottom, 1);

  yield* waitUntil("nix_features");

  yield* swoopTitle(title);

  const features = Array.from({ length: 8 }, () => createRef<Rect>());

  view.add(
    <Rect
      layout
      width="100%"
      height="100%"
      paddingLeft={80}
      paddingRight={80}
      paddingTop={TITLE_FONT_SIZE + TITLE_POSITION.y + title().size().y}
      alignItems="start"
      justifyContent="center"
      gap={CONTENT_GAP}
    >
      <Rect width="50%" direction="column" gap={CONTENT_GAP}>
        <Rect>
          <Feature ref={features[0]}>Development Environments</Feature>
        </Rect>
        <Rect>
          <Feature ref={features[1]}>NixOS</Feature>
        </Rect>
        <Rect>
          <Feature ref={features[2]}>Home-Manager</Feature>
        </Rect>
        <Rect>
          <Feature ref={features[3]}>Nix Darwin</Feature>
        </Rect>
      </Rect>
      <Rect width="50%" direction="column" gap={CONTENT_GAP}>
        <Rect>
          <Feature ref={features[4]}>Run Without Installing</Feature>
        </Rect>
        <Rect>
          <Feature ref={features[5]}>Rollbacks</Feature>
        </Rect>
        <Rect>
          <Feature ref={features[6]}>Easy Deployment</Feature>
        </Rect>
        <Rect>
          <Feature ref={features[7]}>And More...</Feature>
        </Rect>
      </Rect>
    </Rect>,
  );

  yield* waitUntil("nix_features_list");

  for (let i = 0; i < features.length; i++) {
    yield* features[i]().opacity(1, 0.75);
  }
});
