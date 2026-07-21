import { Circle, Icon, Line, makeScene2D, Rect } from "@motion-canvas/2d";
import {
	all,
	chain,
	createRef,
	debug,
	DEFAULT,
	delay,
	Direction,
	easeInElastic,
	easeInOutSine,
	easeOutElastic,
	makeRef,
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

export default makeScene2D(function*(view) {
	view.fill(colors.root.background);

	const title = createRef<Txt>();

	view.add(
		<Txt ref={title} bold position={[0, 0]} fontSize={64}>
			Nix Commands
		</Txt>,
	);

	yield* slideTransition(Direction.Bottom, 1);

	yield* waitUntil("nix_flakes_commands");

	yield* swoopTitle(title);

	const command = createRef<Txt>();

	const uriProtocol = createRef<Txt>();
	const uriSource = createRef<Txt>();
	const uriHash = createRef<Txt>();
	const uriPath = createRef<Txt>();

	view.add(
		<Rect layout>
			<Txt ref={command} />
			<Txt ref={uriProtocol} fill={colors.primary} />
			<Txt ref={uriSource} fill={colors.secondary} />
			<Txt ref={uriHash} />
			<Txt ref={uriPath} fill={colors.nord7} />
		</Rect>,
	);

	yield* waitUntil("nix_flakes_commands_uri_protocol");

	yield* type(1, uriProtocol, "github:");

	yield* waitUntil("nix_flakes_commands_uri_source");

	yield* type(1, uriSource, "jakehamilton/config");

	yield* waitUntil("nix_flakes_commands_uri_hash");

	yield* type(1, uriHash, "#");

	yield* waitUntil("nix_flakes_commands_uri_path");

	yield* type(1, uriPath, "firefox");

	yield* waitUntil("nix_build");

	yield* all(
		command().margin([0, 16, 0, 0], 1),
		type(1, command, "nix build"),
		type(1, uriProtocol, ""),
		type(1, uriSource, ""),
		type(1, uriHash, ""),
		type(1, uriPath, ""),
	);

	yield* waitUntil("nix_build_source");

	yield* type(0.5, uriSource, ".");

	yield* waitUntil("nix_build_hash");

	yield* type(0.5, uriHash, "#");

	yield* waitUntil("nix_build_path");

	yield* type(1, uriPath, "my-package");

	yield* waitUntil("nix_build_path_expanded");

	yield* retype(1, uriPath, "packages.x86_64-linux.my-package");

	yield* waitUntil("nix_build_path_shrunken");

	yield* retype(1, uriPath, "my-package");

	yield* waitUntil("nix_develop");

	yield* all(
		retype(1, command, "nix develop"),
		type(1, uriProtocol, ""),
		type(1, uriSource, ""),
		type(1, uriHash, ""),
		type(1, uriPath, ""),
	);

	yield* waitUntil("nix_develop_protocol");

	yield* type(0.5, uriProtocol, "github:");

	yield* waitUntil("nix_develop_source");

	yield* type(0.5, uriSource, "user/repo");

	yield* waitUntil("nix_develop_hash");

	yield* type(0.5, uriHash, "#");

	yield* waitUntil("nix_develop_path");

	yield* type(0.5, uriPath, "my-shell");

	yield* waitUntil("nix_check");

	yield* all(
		retype(1, command, "nix check"),
		type(1, uriProtocol, ""),
		type(1, uriSource, ""),
		type(1, uriHash, ""),
		type(1, uriPath, ""),
	);

	yield* waitUntil("nix_check_target");

	yield* all(
		type(1, uriProtocol, "gitlab:"),
		type(1, uriSource, "user/repo"),
		type(1, uriHash, "#"),
		type(1, uriPath, "my-check"),
	);

	yield* waitUntil("nix_check_all");

	yield all(type(1, uriHash, ""), type(1, uriPath, ""));

	yield* waitUntil("nix_commands_showcase");

	yield* all(
		type(1, command, ""),
		type(1, uriProtocol, ""),
		type(1, uriSource, ""),
		type(1, uriHash, ""),
		type(1, uriPath, ""),
	);

	yield* type(1, command, "nix flake show");
	yield* all(
		type(1, uriProtocol, "github:"),
		type(1, uriSource, "nixos/nixpkgs"),
	);

	yield* waitFor(2);

	yield* all(
		retype(1, command, "nix build"),
		type(1, uriHash, "#"),
		type(1, uriPath, "firefox"),
	);

	yield* waitFor(2);

	yield* all(
		retype(1, command, "nix develop"),
		retype(1, uriSource, "snowfallorg/dotbox"),
		type(1, uriHash, ""),
		type(1, uriPath, ""),
	);

	yield* waitFor(2);

	yield* all(
		retype(1, command, "nix check"),
		type(1, uriProtocol, ""),
		retype(1, uriSource, "."),
		type(1, uriHash, "#"),
		type(1, uriPath, ""),
	);

	yield* waitFor(useDuration("nix_flakes_commands_end"));
});
