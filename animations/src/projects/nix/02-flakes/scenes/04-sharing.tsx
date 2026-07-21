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
      Sharing Nix Expressions
    </Txt>,
  );

  yield* slideTransition(Direction.Bottom, 1);

  yield* waitUntil("nix_flakes_sharing");

  yield* swoopTitle(title);

  yield* waitUntil("nix_flakes_sharing_content");

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
        language="nix"
        code={`let
in
	# ...`}
      />
    </Content>,
  );

  yield* waitUntil("nix_flakes_sharing_code");

  yield* code().opacity(1, 1);

  yield* code().edit(1)`let${insert(`
	source = builtins.fetchTarball
		"https://github.com/user/repo/archive/master.tar.gz";`)}
in
	# ...`;

  yield* code().edit(1)`let
	source = builtins.fetchTarball
		"https://github.com/user/repo/archive/master.tar.gz";${insert(`
	package = import "\${source}/package.nix";`)}
in
	# ...`;

  yield* code().edit(1, [...lines(1, 4)])`let
	source = builtins.fetchTarball
		"https://github.com/user/repo/archive/master.tar.gz";
	package = import "\${source}/package.nix";${insert(`
	module = "\${source}/mymodule.nix";`)}
in
	# ...`;

  yield* waitUntil("nix_flakes_sharing_path");

  yield* code().selection([...word(3, 11, 30), ...word(4, 10, 24)], 1);

  yield* waitUntil("nix_flakes_sharing_official");

  yield* code().edit(1)`let
	${edit(
    `source = builtins.fetchTarball
		"https://github.com/user/repo/archive/master.tar.gz";
	package = import "\${source}/package.nix";
	module = "\${source}/mymodule.nix";`,
    `flake = builtins.getFlake "github:user/repo";`,
  )}
in
	# ...`;

  yield* waitUntil("nix_flakes_sharing_official_package");

  yield* code().edit(1)`let
	flake = builtins.getFlake "github:user/repo";${insert(`
	package = flake.packages.x86_64-linux.my-package;`)}
in
	# ...`;

  yield* waitUntil("nix_flakes_sharing_official_module");

  yield* code().edit(1, [...lines(1, 3)])`let
	flake = builtins.getFlake "github:user/repo";
	package = flake.packages.x86_64-linux.my-package;${insert(`
	module = flake.nixosModules.mymodule;`)}
in
	# ...`;

  yield* waitFor(useDuration("nix_flakes_sharing_end"));
});
