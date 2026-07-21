import { Circle, Icon, Line, makeScene2D, Rect } from "@motion-canvas/2d";
import {
  all,
  createRef,
  delay,
  Direction,
  easeInElastic,
  easeInOutSine,
  easeOutElastic,
  Reference,
  slideTransition,
  textLerp,
  tween,
  useDuration,
  Vector2,
  waitFor,
  waitUntil,
} from "@motion-canvas/core";
import Arrow from "~/components/arrow";
import Content from "~/components/content";
import List from "~/components/list";
import ListItem from "~/components/list-item";
import { Txt } from "~/components/txt";
import greeting from "~/patterns/greeting";
import * as colors from "~/util/colors";
import { type } from "~/util/text";
import { swoop, swoopTitle } from "~/util/transform";

export const TITLE_POSITION = new Vector2(80, 80);
export const TITLE_FONT_SIZE = 80;

export const CONTENT_GAP = 24;

export default makeScene2D(function* (view) {
  view.fill(colors.root.background);

  const title = createRef<Txt>();

  view.add(
    <Txt ref={title} bold position={[0, 0]} fontSize={64}>
      Input Locking
    </Txt>,
  );

  yield* slideTransition(Direction.Bottom, 1);

  yield* waitUntil("nix_flakes_lock");

  yield* swoopTitle(title);

  yield* waitUntil("nix_flakes_lock_inputs");

  const content = createRef<Rect>();

  view.add(
    <Content
      ref={content}
      alignItems="center"
      justifyContent="center"
      paddingBottom={80}
      gap={64}
    />,
  );

  const inputs = [
    `nixpkgs.url = "github:nixos/nixpkgs/nixos-23.11"`,
    `unstable.url = "github:nixos/nixpkgs/nixos-unstable"`,
  ];

  const refs: Array<{
    rect: Reference<Rect>;
    txt: Reference<Txt>;
    icon: Reference<Icon>;
  }> = [];

  for (let i = 0; i < inputs.length; i++) {
    const rect = createRef<Rect>();
    const txt = createRef<Txt>();
    const icon = createRef<Icon>();

    refs.push({ rect, txt, icon });

    content().insert(
      <Rect ref={rect} gap={24}>
        <Icon ref={icon} icon="ep:lock" size={48} opacity={0} />
        <Txt ref={txt} fontSize={48} position={[0, 0]} />
      </Rect>,
      i,
    );

    yield* type(1, txt, inputs[i]);
  }

  yield* waitUntil("nix_flakes_lock_inputs_collapse");

  for (let i = 0; i < refs.length; i++) {
    const { rect, txt, icon } = refs[i];

    yield* all(
      type(1, txt, inputs[i].split(".")[0]),
      txt().fill(colors.success, 1),
      icon().opacity(1, 0.6),
      icon().color(colors.success, 1),
    );
  }

  const arrow = createRef<Line>();

  const arrowStart = new Vector2(-100, 60);
  const arrowEnd = new Vector2(100, 60);

  view.add(
    <Arrow
      ref={arrow}
      points={[
        [0, 0],
        [0, 0],
      ]}
      position={[-100, 60]}
    />,
  );

  yield* all(
    content().position([-300, 0], 1),
    delay(0.3, arrow().position([0, 0], 1)),
    delay(0.3, arrow().points([arrowStart, arrowEnd], 1)),
  );

  const file = createRef<Icon>();
  const name = createRef<Txt>();

  view.add(
    <Rect position={[240, 60]} layout direction="column" alignItems="center">
      <Icon
        ref={file}
        icon="ep:lock"
        size={128}
        position={[-100, 0]}
        scale={0}
      />
      <Txt ref={name} fontSize={48} marginTop={12} height={0} />
    </Rect>,
  );

  yield* waitUntil("nix_flakes_lock_file");

  yield* all(
    file().scale(1, 0.5),
    file().color(colors.success, 1),
    name().fill(colors.success, 1),
    delay(0.25, name().height(48, 0.5)),
    delay(0.5, type(0.5, name, "flake.lock")),
  );

  const success = createRef<Icon>();

  view.add(
    <Icon
      ref={success}
      icon="ep:success-filled"
      size={128}
      position={[0, -80]}
      scale={0}
    />,
  );

  yield* waitUntil("nix_flakes_lock_success");

  yield* all(success().scale(1, 1), success().color(colors.success, 1));

  yield* waitFor(useDuration("nix_flakes_end"));
});
