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
      Getting Started
    </Txt>,
  );

  yield* slideTransition(Direction.Bottom, 1);

  yield* waitUntil("nix_flakes_starting");

  yield* swoopTitle(title);

  yield* waitUntil("nix_flakes_starting_content");

  const content = createRef<Rect>();

  const code = createRef<CodeBlock>();

  view.add(
    <Content
      ref={content}
      alignItems="center"
      justifyContent="center"
      paddingBottom={80}
      gap={64}
    >
      <CodeBlock
        ref={code}
        opacity={0}
        language="ini"
        code={`experimental-features = nix-command flakes`}
      />
    </Content>,
  );

  yield* waitUntil("nix_flakes_starting_code");

  yield* code().opacity(1, 1);

  const file = createRef<Txt>();

  view.add(<Txt ref={file} position={[0, -20]} fontSize={48} bold></Txt>);

  yield* waitUntil("nix_flakes_starting_nix");

  yield* type(1, file, "/etc/nix/nix.conf");

  yield* waitUntil("nix_flakes_starting_nixos");

  yield* all(
    retype(1, file, "/etc/nixos/configuration.nix"),
    file().position([0, -150], 1),
    delay(0.5, code().language("nix", 0)),
    code().edit(1)`${edit(
      `experimental-features = nix-command flakes`,
      `{
	nix.settings.experimental-features = [
		"nix-command"
		"flakes"
	];
}`,
    )}`,
  );

  yield* waitFor(useDuration("nix_flakes_starting_end"));
});
