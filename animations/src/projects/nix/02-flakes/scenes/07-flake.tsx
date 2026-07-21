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
      flake.nix
    </Txt>,
  );

  yield* slideTransition(Direction.Bottom, 1);

  yield* waitUntil("nix_flakes_flake");

  yield* swoopTitle(title);

  const content = createRef<Rect>();
  const code = createRef<CodeBlock>();

  view.add(
    <Content ref={content} paddingLeft={80} paddingRight={80} opacity={0}>
      <CodeBlock ref={code} language="nix" code={"{\n}"} textWrap />
    </Content>,
  );

  yield* content().opacity(1, 1);

  yield* waitUntil("nix_flakes_flake_inputs");

  yield* code().edit(1)`{${insert(`
	inputs = /* inputs here */;`)}
}`;

  yield* waitUntil("nix_flakes_flake_output");

  yield* code().edit(1)`{
	inputs = /* inputs here */;${insert(`
	outputs = /* outputs here */;`)}
}`;

  yield* waitUntil("nix_flakes_flake_inputs_focus");

  yield* code().selection([...lines(1)], 1);

  yield* waitUntil("nix_flakes_flake_inputs_nixpkgs");

  yield* code().edit(1, [...lines(1, 3)])`{
	inputs = ${edit(
    `/* inputs here */`,
    `{
		nixpkgs.url = "github:nixos/nixpkgs/nixos-23.11";
	}`,
  )};
	outputs = /* outputs here */;
}`;

  yield* waitUntil("nix_flakes_flake_inputs_path");

  yield* code().edit(1, [...lines(1, 4)])`{
	inputs = {
		nixpkgs.url = "github:nixos/nixpkgs/nixos-23.11";${insert(`
		my-path-flake.url = "path:./my/flake";`)}
	};
	outputs = /* outputs here */;
}`;

  yield* waitUntil("nix_flakes_flake_inputs_git");

  yield* code().edit(1, [...lines(1, 5)])`{
	inputs = {
		nixpkgs.url = "github:nixos/nixpkgs/nixos-23.11";
		my-path-flake.url = "path:./my/flake";${insert(`
		my-git-flake.url = "git+ssh://example.com/user/repo.git";`)}
	};
	outputs = /* outputs here */;
}`;

  yield* waitUntil("nix_flakes_flake_inputs_tarball");

  yield* code().edit(1, [...lines(1, 5)])`{
	inputs = {
		nixpkgs.url = "github:nixos/nixpkgs/nixos-23.11";
		my-path-flake.url = "path:./my/flake";
		my-git-flake.url = "git+ssh://example.com/user/repo.git";${insert(`
		my-tarball-flake.url = "https://example.com/flake.tar.gz";`)}
	};
	outputs = /* outputs here */;
}`;

  yield* waitUntil("nix_flakes_flake_outputs_focus");

  yield* code().edit(1, [...lines(2)])`{
	inputs = {${edit(
    `
		nixpkgs.url = "github:nixos/nixpkgs/nixos-23.11";
		my-path-flake.url = "path:./my/flake";
		my-git-flake.url = "git+ssh://example.com/user/repo.git";
		my-tarball-flake.url = "https://example.com/flake.tar.gz";
	`,
    "/* ... */",
  )}};
	outputs = /* outputs here */;
}`;

  yield* waitUntil("nix_flakes_flake_outputs_function");

  yield* code().edit(2, [...lines(2, 3)])`{
	inputs = {/* ... */};
	outputs = ${edit(
    `/* outputs here */`,
    `args: {
	}`,
  )};
}`;

  yield* waitUntil("nix_flakes_flake_outputs_function_args");

  yield* code().edit(1, [...lines(2, 3)])`{
	inputs = {/* ... */};
	outputs = ${edit(`args`, `inputs`)}: {
	};
}`;

  yield* waitUntil("nix_flakes_flake_outputs_function_args_expanded");

  yield* code().edit(1, [...lines(2, 4)])`{
	inputs = {/* ... */};
	outputs = ${edit(`inputs`, `{ nixpkgs, my-tarball-flake, ... }`)}: {${insert(`
		/* exported items here */`)}
	};
}`;

  yield* waitUntil("nix_flakes_flake_outputs_packages");

  yield* code().edit(1)`{
	inputs = {/* ... */};
	outputs = { nixpkgs, my-tarball-flake, ... }: {
		${edit(`/* exported items here */`, `packages = /* ... */;`)}
	};
}`;

  yield* waitUntil("nix_flakes_flake_outputs_devshells");

  yield* code().edit(1)`{
	inputs = {/* ... */};
	outputs = { nixpkgs, my-tarball-flake, ... }: {
		packages = /* ... */;${insert(`
		devShells = /* ... */;`)}
	};
}`;

  yield* waitUntil("nix_flakes_flake_outputs_checks");

  yield* code().edit(1)`{
	inputs = {/* ... */};
	outputs = { nixpkgs, my-tarball-flake, ... }: {
		packages = /* ... */;
		devShells = /* ... */;${insert(`
		checks = /* ... */;`)}
	};
}`;

  yield* waitUntil("nix_flakes_flake_outputs_nixosConfigurations");

  yield* code().edit(1)`{
	inputs = {/* ... */};
	outputs = { nixpkgs, my-tarball-flake, ... }: {
		packages = /* ... */;
		devShells = /* ... */;
		checks = /* ... */;${insert(`
		nixosConfigurations = /* ... */;`)}
	};
}`;

  yield* waitUntil("nix_flakes_flake_outputs_nixosModules");

  yield* code().edit(1)`{
	inputs = {/* ... */};
	outputs = { nixpkgs, my-tarball-flake, ... }: {
		packages = /* ... */;
		devShells = /* ... */;
		checks = /* ... */;
		nixosConfigurations = /* ... */;${insert(`
		nixosModules = /* ... */;`)}
	};
}`;

  yield* waitFor(1);

  yield* code().selection([...lines(3, 7)], 1);

  yield* waitUntil("nix_flakes_flake_packages");

  yield* code().edit(1, [...lines(3, 4)])`{
	inputs = {/* ... */};
	outputs = { nixpkgs, my-tarball-flake, ... }: {
		${edit("packages", "packages.x86_64-linux.firefox")} = ${edit(
      `/* ... */`,
      `
			nixpkgs.legacyPackages.x86_64-linux.firefox`,
    )};
		devShells = /* ... */;
		checks = /* ... */;
		nixosConfigurations = /* ... */;
		nixosModules = /* ... */;
	};
}`;

  yield* waitUntil("nix_flakes_flake_devshells");

  yield* code().edit(1, [...lines(5, 6)])`{
	inputs = {/* ... */};
	outputs = { nixpkgs, my-tarball-flake, ... }: {
		packages.x86_64-linux.firefox =
			nixpkgs.legacyPackages.x86_64-linux.firefox;
		${edit("devShells", "devShells.x86_64-linux.default")} = ${edit(
      `/* ... */`,
      `
			nixpkgs.legacyPackages.x86_64-linux.mkShell {}`,
    )};
		checks = /* ... */;
		nixosConfigurations = /* ... */;
		nixosModules = /* ... */;
	};
}`;

  yield* waitUntil("nix_flakes_flake_checks");

  yield* code().edit(1, [...lines(7, 10)])`{
	inputs = {/* ... */};
	outputs = { nixpkgs, my-tarball-flake, ... }: {
		packages.x86_64-linux.firefox =
			nixpkgs.legacyPackages.x86_64-linux.firefox;
		devShells.x86_64-linux.default =
			nixpkgs.legacyPackages.x86_64-linux.mkShell {};
		${edit("checks", "checks.x86_64-linux.unitTests")} = ${edit(
      `/* ... */`,
      `
			nixpkgs.legacyPackages.x86_64-linux.runCommand {} ''
				make test
			''`,
    )};
		nixosConfigurations = /* ... */;
		nixosModules = /* ... */;
	};
}`;

  yield* waitUntil("nix_flakes_flake_nixosConfigurations");

  yield* code().edit(1, [...lines(11)])`{
	inputs = {/* ... */};
	outputs = { nixpkgs, my-tarball-flake, ... }: {
		packages.x86_64-linux.firefox =
			nixpkgs.legacyPackages.x86_64-linux.firefox;
		devShells.x86_64-linux.default =
			nixpkgs.legacyPackages.x86_64-linux.mkShell {};
		checks.x86_64-linux.unitTests =
			nixpkgs.legacyPackages.x86_64-linux.runCommand {} ''
				make test
			'';
		${edit("nixosConfigurations", "nixosConfigurations.myhost")} = ${edit(
      `/* ... */`,
      `nixpkgs.lib.nixosSystem {}`,
    )};
		nixosModules = /* ... */;
	};
}`;

  yield* waitUntil("nix_flakes_flake_nixosModules");

  yield* code().edit(1, [...lines(12)])`{
	inputs = {/* ... */};
	outputs = { nixpkgs, my-tarball-flake, ... }: {
		packages.x86_64-linux.firefox =
			nixpkgs.legacyPackages.x86_64-linux.firefox;
		devShells.x86_64-linux.default =
			nixpkgs.legacyPackages.x86_64-linux.mkShell {};
		checks.x86_64-linux.unitTests =
			nixpkgs.legacyPackages.x86_64-linux.runCommand {} ''
				make test
			'';
		nixosConfigurations.myhost = nixpkgs.lib.nixosSystem {};
		${edit("nixosModules", "nixosModules.zsh")} = ${edit(
      `/* ... */`,
      `{ programs.zsh.enable = true; }`,
    )};
	};
}`;

  yield* waitUntil("nix_flakes_flake_packages_2");

  yield* code().selection([...word(3, 2, "packages".length)], 1);
  yield* waitUntil("nix_flakes_flake_devshells_2");

  yield* code().selection(
    [...word(3, 2, "packages".length), ...word(5, 2, "devShells".length)],
    1,
  );

  yield* waitUntil("nix_flakes_flake_checks_2");

  yield* code().selection(
    [
      ...word(3, 2, "packages".length),
      ...word(5, 2, "devShells".length),
      ...word(7, 2, "checks".length),
    ],
    1,
  );

  yield* waitUntil("nix_flakes_flake_systems");

  yield* code().selection(
    [
      ...word(3, 2, "packages.x86_64-linux".length),
      ...word(5, 2, "devShells.x86_64-linux".length),
      ...word(7, 2, "checks.x86_64-linux".length),
    ],
    1,
  );

  yield* waitFor(4);

  yield* code().selection(DEFAULT, 1);

  yield* waitUntil("nix_flakes_flake_nixos");

  yield* code().selection(
    [
      ...word(11, 2, "nixosConfigurations.myhost".length),
      ...word(12, 2, "nixosModules.zsh".length),
    ],
    1,
  );

  yield* waitFor(4);

  yield* code().selection(DEFAULT, 1);

  yield* waitFor(useDuration("nix_flakes_flake_end"));
});
