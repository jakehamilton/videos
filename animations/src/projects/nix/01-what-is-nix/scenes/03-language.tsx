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
} from "@motion-canvas/core";
import { CodeBlock, insert } from "@motion-canvas/2d/lib/components/CodeBlock";
import { Txt } from "~/components/txt";
import * as colors from "~/util/colors";
import { swoop, swoopTitle } from "~/util/transform";
import { CONTENT_GAP, TITLE_FONT_SIZE, TITLE_POSITION } from "./01-intro";
import { retype } from "~/util/text";

export default makeScene2D(function* (view) {
  view.fill(colors.root.background);

  const title = createRef<Txt>();

  view.add(
    <Txt ref={title} bold fontSize={64}>
      Language
    </Txt>,
  );

  yield* slideTransition(Direction.Bottom, 1);

  yield* retype(2, title, "Nix (The Language)");

  yield* swoopTitle(title);

  const code = createRef<CodeBlock>();

  view.add(
    <Rect
      layout
      width="100%"
      height="100%"
      paddingLeft={80}
      paddingRight={80}
      paddingTop={TITLE_FONT_SIZE + TITLE_POSITION.y + title().size().y}
    >
      <Rect>
        <CodeBlock ref={code} language="nix" code={""} />
      </Rect>
    </Rect>,
  );

  yield* waitUntil("nix_language_code");

  yield* code().edit(1)`${insert(`stdenv.mkDerivation {
	name = "my-package";
}`)}`;

  yield* waitUntil("nix_language_code_inputs");

  yield* code().edit(1)`stdenv.mkDerivation {
	name = "my-package";${insert(`

	src = fetchFromGitHub {
		owner = "my-org";
		repo = "my-repo";
		rev = "v1.0.0";
		sha256 = "0x...";
	};`)}
}`;

  yield* waitUntil("nix_language_code_source");

  yield* code().edit(1)`stdenv.mkDerivation {
	name = "my-package";

	src = fetchFromGitHub {
		owner = "my-org";
		repo = "my-repo";
		rev = "v1.0.0";
		sha256 = "0x...";
	};${insert(`

	buildInputs = [ pkgs.clang ];`)}
}`;

  yield* waitFor(2);

  yield* code().selection(DEFAULT, 1);

  const iconSize = 256;
  const initialIconPosition = new Vector2(128, 0);
  const finalIconPosition = initialIconPosition.addX(iconSize * 1.5);

  const calendar = createRef<Icon>();
  view.add(
    <Icon
      ref={calendar}
      icon="material-symbols:calendar-clock-rounded"
      size={iconSize}
      position={initialIconPosition}
      opacity={0}
    />,
  );

  const calendarNext = createRef<Icon>();
  view.add(
    <Icon
      ref={calendarNext}
      icon="material-symbols:calendar-add-on-rounded"
      size={256}
      position={initialIconPosition}
      opacity={0}
    />,
  );

  const success = createRef<Icon>();
  view.add(
    <Icon
      ref={success}
      icon="ep:success-filled"
      size={256}
      position={initialIconPosition}
      opacity={0}
    />,
  );

  yield* waitUntil("nix_language_code_calendar");

  yield* all(
    calendar().opacity(1, 0.5),
    swoop(calendar, {
      x: finalIconPosition.x,
      y: -iconSize - CONTENT_GAP,
    }),
  );

  yield* waitUntil("nix_language_code_calendar_next");

  yield* all(
    calendarNext().opacity(1, 0.5),
    swoop(calendarNext, {
      x: finalIconPosition.x,
      y: 0,
    }),
  );

  yield* waitUntil("nix_language_code_calendar_success");

  yield* all(
    success().opacity(1, 0.5),
    swoop(success, {
      x: finalIconPosition.x,
      y: iconSize + CONTENT_GAP,
    }),
    success().color(colors.success, 1),
  );

  yield* waitFor(2);
});
