import { Circle, Icon, Line, makeScene2D, Rect } from "@motion-canvas/2d";
import {
  CodeBlock,
  insert,
  edit,
  lines,
  word,
} from "@motion-canvas/2d/lib/components/CodeBlock";
import {
  all,
  createRef,
  DEFAULT,
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
import { retype, type } from "~/util/text";
import { swoop, swoopTitle } from "~/util/transform";

export const TITLE_POSITION = new Vector2(80, 80);
export const TITLE_FONT_SIZE = 80;

export const CONTENT_GAP = 24;

export default makeScene2D(function* (view) {
  view.fill(colors.root.background);

  const title = createRef<Txt>();

  view.add(
    <Txt ref={title} bold position={[0, 0]} fontSize={64}>
      Creating A Flake
    </Txt>,
  );

  yield* slideTransition(Direction.Bottom, 1);

  yield* waitUntil("nix_flakes_init");

  yield* swoopTitle(title);

  const content = createRef<Rect>();
  const command = createRef<Txt>();

  view.add(<Txt ref={command} />);

  yield* waitUntil("nix_flakes_init_command");

  yield* type(1, command, "nix flake init");

  const arrow = createRef<Line>();

  const arrowStart = new Vector2(0, -50);
  const arrowEnd = new Vector2(0, 100);

  const fileRect1 = createRef<Rect>();
  const file1 = createRef<Icon>();
  const name1 = createRef<Txt>();
  const fileRect2 = createRef<Rect>();
  const file2 = createRef<Icon>();
  const name2 = createRef<Txt>();

  view.add(
    <>
      <Arrow
        ref={arrow}
        points={[
          [0, 0],
          [0, 0],
        ]}
        position={arrowStart}
      />
      <Rect
        ref={fileRect1}
        position={[0, 224]}
        layout
        direction="column"
        alignItems="center"
      >
        <Icon
          ref={file1}
          icon="ic:insert-drive-file"
          size={128}
          position={[-100, 0]}
          scale={0}
        />
        <Txt ref={name1} fontSize={48} marginTop={12} height={0} />
      </Rect>
      <Rect
        ref={fileRect2}
        position={[0, 224]}
        layout
        direction="column"
        alignItems="center"
      >
        <Icon
          ref={file2}
          icon="ep:lock"
          size={128}
          position={[-200, 0]}
          scale={0}
        />
        <Txt ref={name2} fontSize={48} marginTop={12} height={0} />
      </Rect>
    </>,
  );

  yield* waitUntil("nix_flakes_init_arrow");

  yield* all(
    command().position.y(-100, 1),
    delay(0.75, arrow().position([0, 0], 1)),
    delay(0.75, arrow().points([arrowStart, arrowEnd], 1)),
    delay(0.75, file1().scale(1, 0.5)),
    delay(1, name1().height(48, 0.5)),
    delay(2, type(0.5, name1, "flake.nix")),
    delay(2, arrow().position(arrowEnd, 1)),
    delay(
      2,
      arrow().points(
        [
          [0, 0],
          [0, 0],
        ],
        1,
      ),
    ),
  );

  yield* waitUntil("nix_flakes_init_lock");

  yield* retype(1, command, "nix flake lock");

  yield* all(
    arrow().position(arrowStart, 0),
    fileRect1().position.x(-300, 1),
    delay(0.75, arrow().position([0, 0], 1)),
    delay(0.75, arrow().points([arrowStart, arrowEnd], 1)),
    delay(0.75, file2().scale(1, 0.5)),
    delay(1, name2().height(48, 0.5)),
  );

  yield* all(
    type(0.5, name2, "flake.lock"),
    arrow().position(arrowEnd, 1),
    arrow().points(
      [
        [0, 0],
        [0, 0],
      ],
      1,
    ),
    delay(0.5, file2().color(colors.success, 1)),
    delay(0.5, name2().fill(colors.success, 1)),
  );

  yield* waitFor(useDuration("nix_flakes_init_end"));
});
