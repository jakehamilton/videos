import {
  Circle,
  Icon,
  Img,
  makeScene2D,
  Rect,
  JSX,
  Line,
} from "@motion-canvas/2d";
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
import { type } from "~/util/text";
import Arrow from "~/components/arrow";

export default makeScene2D(function* (view) {
  view.fill(colors.root.background);

  const title = createRef<Txt>();

  view.add(
    <Txt ref={title} bold fontSize={64}>
      Channels
    </Txt>,
  );

  yield* slideTransition(Direction.Bottom, 1);

  yield* waitUntil("nix_channels");

  yield* swoopTitle(title);

  const channel = createRef<Txt>();

  view.add(<Txt ref={channel} fontSize={48} fill={colors.root.foreground} />);

  yield* waitUntil("nix_channels_nixpkgs");

  yield* type(0.5, channel, "<nixpkgs>");

  yield* waitUntil("nix_channels_path");

  const path = createRef<Txt>();

  view.add(<Txt ref={path} fontSize={48} position={[300, 0]} />);

  yield* all(
    channel().position([-300, 0], 1),
    delay(0.5, type(1.5, path, "/nix/store/abc-nixos-23.11")),
  );

  yield* waitUntil("nix_channels_connect");

  const arrow = createRef<Line>();

  const arrowStart = new Vector2(-150, 0);
  const arrowEnd = new Vector2(-10, 0);

  view.add(
    <Arrow
      ref={arrow}
      points={[
        [0, 0],
        [0, 0],
      ]}
      position={[-150, 0]}
    />,
  );

  yield* all(
    arrow().position([0, 0], 1),
    arrow().points([arrowStart, arrowEnd], 1),
    channel().fill(colors.primary, 1),
    path().fill(colors.secondary, 1),
  );

  const path2 = createRef<Txt>();

  view.add(<Txt ref={path2} fontSize={48} position={[336, 100]} />);

  yield* waitUntil("nix_channels_path2");

  yield* type(1, path2, "/nix/store/xyz-nixos-unstable");

  yield* waitUntil("nix_channels_connect2");

  yield* all(
    arrow().position([0, 98], 1),
    path().fill(colors.root.foreground, 1),
    path2().fill(colors.secondary, 1),
  );

  yield* waitUntil("nix_channels_incompatible");

  yield* all(
    arrow().points(
      [
        [0, 0],
        [0, 0],
      ],
      1,
    ),
    path2().fill(colors.root.foreground, 1),
  );

  arrow().remove();

  const success = createRef<Icon>();
  const failure = createRef<Icon>();

  view.add(
    <>
      <Icon
        ref={success}
        icon="ep:success-filled"
        size={64}
        position={[-80, -4]}
        scale={0}
        color={colors.success}
      />
      <Icon
        ref={failure}
        icon="ep:circle-close-filled"
        size={64}
        position={[-80, 94]}
        scale={0}
        color={colors.failure}
      />
    </>,
  );

  yield* all(path().fill(colors.success, 1), success().scale(1, 1));

  yield* waitFor(1);

  yield* all(path2().fill(colors.failure, 1), failure().scale(1, 1));

  yield* waitFor(1.5);
});
