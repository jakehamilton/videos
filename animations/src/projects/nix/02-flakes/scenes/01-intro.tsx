import { Circle, makeScene2D, Rect } from "@motion-canvas/2d";
import {
  all,
  createRef,
  easeInElastic,
  easeInOutSine,
  easeOutElastic,
  Reference,
  textLerp,
  tween,
  useDuration,
  Vector2,
  waitFor,
  waitUntil,
} from "@motion-canvas/core";
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

  yield* greeting(view);

  const title = createRef<Txt>();

  view.add(<Txt ref={title} bold position={[0, 0]} fontSize={64}></Txt>);

  yield* type(0.5, title, "Nix Flakes");

  yield* waitUntil("nix_flakes_confusing");

  const points = [
    { x: -700, y: -300, r: -10 },
    { x: 700, y: -300, r: 10 },
    { x: -380, y: 0, r: 10 },
    { x: 380, y: 0, r: -10 },
    { x: -700, y: 300, r: -10 },
    { x: 700, y: 300, r: 10 },
  ];

  const marks = [];

  for (let i = 0; i < points.length; i++) {
    const point = points[i];
    const text = createRef<Txt>();
    marks.push(text);

    view.add(
      <Txt
        ref={text}
        position={{ x: point.x, y: point.y }}
        scale={0}
        fontSize={128}
        bold
        fill={colors.raised.background}
        rotation={point.r}
      >
        ?
      </Txt>,
    );

    yield* text().scale(1, 0.25, easeOutElastic);
  }

  yield* waitUntil("nix_flakes_confusing_end");

  yield* all(...marks.map((mark) => mark().scale(0, 0.75, easeInElastic)));

  for (const mark of marks) {
    mark().remove();
  }

  yield* waitUntil("nix_flakes");

  yield* swoopTitle(title);

  yield* waitUntil("nix_flakes_problems");

  const content = createRef<Rect>();
  const list = createRef<Rect>();

  view.add(
    <Content ref={content}>
      <List ref={list}></List>
    </Content>,
  );

  const problems = ["Dependency locking", "Sharing Nix expressions"];
  const items: Array<Reference<Rect>> = [];

  for (let i = 0; i < problems.length; i++) {
    const item = createRef<Rect>();
    const text = createRef<Txt>();
    items.push(item);

    list().insert(
      <ListItem ref={item} opacity={0}>
        <Txt ref={text} />
      </ListItem>,
      i,
    );

    yield* waitUntil(`nix_flakes_problems_${i}`);

    yield* item().opacity(1, 0.15);
    yield* type(1, text, problems[i]);
  }

  yield* waitUntil("nix_flakes_problems_focus");

  yield* items[1]().opacity(0.5, 1);

  yield* waitFor(useDuration("nix_flakes_problems_end"));
});
