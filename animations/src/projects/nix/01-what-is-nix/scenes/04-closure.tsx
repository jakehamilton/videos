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
  DEFAULT,
  chain,
  Reference,
} from "@motion-canvas/core";
import { CodeBlock, insert } from "@motion-canvas/2d/lib/components/CodeBlock";
import { Txt } from "~/components/txt";
import * as colors from "~/util/colors";
import { swoop, swoopTitle } from "~/util/transform";
import { CONTENT_GAP, TITLE_FONT_SIZE, TITLE_POSITION } from "./01-intro";
import { retype } from "~/util/text";
import firefoxImage from "../assets/firefox.png";

export default makeScene2D(function* (view) {
  view.fill(colors.root.background);

  const title = createRef<Txt>();

  view.add(
    <Txt ref={title} bold fontSize={64}>
      Isolation
    </Txt>,
  );

  yield* slideTransition(Direction.Bottom, 1);

  yield* waitUntil("nix_isolation");

  yield* swoopTitle(title);

  const layout = createRef<Rect>();

  const package1 = createRef<Rect>();
  const packageContainer1 = createRef<Rect>();

  const package2 = createRef<Rect>();
  const packageContainer2 = createRef<Rect>();

  view.add(
    <Rect
      ref={layout}
      layout
      width="100%"
      height="100%"
      paddingLeft={80}
      paddingRight={80}
      paddingTop={TITLE_FONT_SIZE + TITLE_POSITION.y + title().size().y}
      alignItems="start"
      justifyContent="center"
    >
      <Rect
        ref={package1}
        width={0}
        radius={16}
        stroke="rgba(67, 76, 94, 0)"
        lineWidth={0}
        padding={16}
        direction="column"
        alignItems="center"
        justifyContent="start"
        gap={8}
        opacity={0}
      >
        <Img src={firefoxImage} size={128} />
      </Rect>
    </Rect>,
  );

  yield* waitUntil("nix_isolation_package1");

  yield* all(
    package1().opacity(1, 1),
    package1().width(400, 1),
    package1().lineWidth(4, 1),
  );

  package1().insert(
    <Rect
      ref={packageContainer1}
      width={0}
      padding={0}
      fill={colors.raised.background}
      justifyContent="space-around"
      radius={8}
      wrap="wrap"
    />,
    1,
  );

  yield* all(
    packageContainer1().width(374, 1),
    packageContainer1().padding(16, 1),
    package1().stroke(colors.raised.background, 1),
  );

  const icons1: Array<Reference<Icon>> = [];
  const iconColors1 = [
    colors.root.foreground,
    colors.primary,
    colors.root.foreground,
    colors.root.foreground,
    colors.primary,
    colors.root.foreground,
  ];

  for (let i = 0; i < 6; i++) {
    const icon = createRef<Icon>();
    icons1.push(icon);

    const row = Math.floor(i / 2);
    const containerHeight = 32 + (row + 1) * 128;

    packageContainer1().insert(
      <Icon
        ref={icon}
        size={0}
        icon="material-symbols:deployed-code"
        opacity={0}
        position={new Vector2(0, containerHeight / 2)}
        color={iconColors1[i]}
      />,
      i,
    );

    icon().reparent(view);

    const containerPosition = packageContainer1().absolutePosition();
    const spawnPosition = new Vector2(0, -48).add(containerPosition);
    const finalPosition = spawnPosition.transformAsPoint(
      packageContainer1().worldToLocal(),
    );

    yield* icon().position(finalPosition, 0);

    yield* all(
      icon().opacity(1, 0.25),
      icon().size(128, 0.25),
      packageContainer1().height(containerHeight, 0.25),
      swoop(icon, {
        x: finalPosition.x + (i % 2 === 0 ? -1 : 1) * 86,
        y: finalPosition.y + 48 + (row * 128) / 2 - 64 + row * 64 + 12,
        xSpeed: 0.45,
        ySpeed: 0.45,
      }),
    );
  }

  for (const icon of icons1) {
    icon().reparent(packageContainer1());
  }

  yield* waitUntil("nix_isolation_package2");

  const package2ImageContainer = createRef<Rect>();
  const package2Image = createRef<Img>();
  const package2ImageLabel = createRef<Txt>();

  layout().insert(
    <Rect
      width={0}
      ref={package2}
      radius={16}
      stroke="rgba(67, 76, 94, 0)"
      lineWidth={0}
      padding={0}
      direction="column"
      alignItems="center"
      justifyContent="start"
      gap={8}
      opacity={0}
      marginLeft={0}
    >
      <Rect width={128} height={128}>
        <Rect ref={package2ImageContainer} layout={false} scale={0}>
          <Img ref={package2Image} src={firefoxImage} size={0} />
          <Rect
            position={new Vector2(36, 24)}
            fill={"black"}
            width={100}
            // @ts-ignore
            height="1em"
          >
            <Txt
              ref={package2ImageLabel}
              text="beta"
              scale={0}
              fontSize={32}
              position={new Vector2(0, 2)}
            />
          </Rect>
        </Rect>
      </Rect>
    </Rect>,
    1,
  );

  yield* all(
    package2().opacity(1, 0.5),
    package2().width(400, 0.5),
    package2().padding(16, 0.5),
    package2().stroke(colors.raised.background, 0.5),
    package2().lineWidth(4, 0.5),
    package2().margin([0, 0, 0, CONTENT_GAP], 0.5),
    package2Image().size(128, 0.5),
    package2ImageLabel().scale(1, 0.5),
    package2ImageContainer().scale(1, 0.5),
  );

  package2().insert(
    <Rect
      ref={packageContainer2}
      width={0}
      padding={0}
      fill={colors.raised.background}
      justifyContent="space-around"
      radius={8}
      wrap="wrap"
    />,
    1,
  );

  yield* all(
    packageContainer2().width(374, 0.5),
    packageContainer2().padding(16, 0.5),
    package2().stroke(colors.raised.background, 0.5),
  );

  const icons2: Array<Reference<Icon>> = [];
  const iconColors2 = [
    colors.root.foreground,
    colors.root.foreground,
    colors.secondary,
    colors.root.foreground,
    colors.root.foreground,
    colors.secondary,
  ];

  for (let i = 0; i < 6; i++) {
    const icon = createRef<Icon>();
    icons2.push(icon);

    const row = Math.floor(i / 2);
    const containerHeight = 32 + (row + 1) * 128;

    packageContainer2().insert(
      <Icon
        ref={icon}
        size={0}
        icon="material-symbols:deployed-code"
        opacity={0}
        position={new Vector2(0, containerHeight / 2)}
        color={iconColors2[i]}
      />,
      i,
    );

    icon().reparent(view);

    const containerPosition = packageContainer2().absolutePosition();
    const spawnPosition = new Vector2(200 + CONTENT_GAP / 2, -48).add(
      containerPosition,
    );
    const finalPosition = spawnPosition.transformAsPoint(
      packageContainer2().worldToLocal(),
    );

    yield* icon().position(finalPosition, 0);

    yield* all(
      icon().opacity(1, 0.5),
      icon().size(128, 0.5),
      packageContainer2().height(containerHeight, 0.25),
      swoop(icon, {
        x: finalPosition.x + (i % 2 === 0 ? -1 : 1) * 86,
        y: finalPosition.y + 48 + (row * 128) / 2 - 64 + row * 64 + 12,
        xSpeed: 0.5,
        ySpeed: 0.5,
      }),
    );
  }

  for (const icon of icons2) {
    icon().reparent(packageContainer2());
  }

  yield* waitUntil("nix_isolation_apt_example");

  yield* all(
    icons1[1]().color(colors.failure, 0.5),
    icons1[4]().color(colors.failure, 0.5),
    icons2[2]().color(colors.failure, 0.5),
    icons2[5]().color(colors.failure, 0.5),
  );

  yield* waitFor(5);

  yield* all(
    icons1[1]().color(colors.success, 0.5),
    icons1[4]().color(colors.success, 0.5),
    icons2[2]().color(colors.success, 0.5),
    icons2[5]().color(colors.success, 0.5),
  );

  yield* waitFor(4);
});
