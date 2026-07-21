import { Circle, Icon, Line, makeScene2D, Rect } from "@motion-canvas/2d";
import {
  all,
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

export default makeScene2D(function* (view) {
  view.fill(colors.root.background);

  const title = createRef<Txt>();

  view.add(
    <Txt ref={title} bold position={[0, 0]} fontSize={64}>
      Discovering Outputs
    </Txt>,
  );

  yield* slideTransition(Direction.Bottom, 1);

  yield* waitUntil("nix_flakes_outputs");

  yield* retype(1, title, "nix flake show");

  yield* swoopTitle(title);

  yield* waitUntil("nix_flakes_outputs_show");

  yield* waitUntil("nix_flakes_outputs_show_content");

  const showContent = createRef<Rect>();

  const descriptions: Array<Reference<Txt>> = [];
  const descriptionsText = [
    "firefox-v123",
    "Development Shell",
    "unit-tests",
    "NixOS System",
    "NixOS Module",
  ];

  view.add(
    <Rect
      ref={showContent}
      layout
      direction="column"
      gap={CONTENT_GAP}
      position={[0, 80]}
      height={0}
      scale={0}
      clip
      fill={colors.raised.background}
      padding={32}
      radius={16}
    >
      <Rect direction="column">
        <Txt>packages</Txt>
        <Rect paddingLeft={32}>
          <Txt fontSize={36}>x86_64-linux</Txt>
          <Txt fontSize={36}>.</Txt>
          <Txt fontSize={36}>firefox</Txt>
          <Txt
            ref={makeRef(descriptions, 0)}
            fontSize={36}
            fill={colors.primary}
          />
        </Rect>
      </Rect>
      <Rect direction="column">
        <Txt>devShells</Txt>
        <Rect paddingLeft={32}>
          <Txt fontSize={36}>x86_64-linux</Txt>
          <Txt fontSize={36}>.</Txt>
          <Txt fontSize={36}>default</Txt>
          <Txt
            ref={makeRef(descriptions, 1)}
            fontSize={36}
            fill={colors.primary}
          />
        </Rect>
      </Rect>
      <Rect direction="column">
        <Txt>checks</Txt>
        <Rect paddingLeft={32}>
          <Txt fontSize={36}>x86_64-linux</Txt>
          <Txt fontSize={36}>.</Txt>
          <Txt fontSize={36}>unitTests</Txt>
          <Txt
            ref={makeRef(descriptions, 2)}
            fontSize={36}
            fill={colors.primary}
          />
        </Rect>
      </Rect>
      <Rect direction="column">
        <Txt>nixosConfigurations</Txt>
        <Rect paddingLeft={32}>
          <Txt fontSize={36}>myhost</Txt>
          <Txt
            ref={makeRef(descriptions, 3)}
            fontSize={36}
            fill={colors.primary}
          />
        </Rect>
      </Rect>
      <Rect direction="column">
        <Txt>nixosModules</Txt>
        <Rect paddingLeft={32}>
          <Txt fontSize={36}>zsh</Txt>
          <Txt
            ref={makeRef(descriptions, 4)}
            fontSize={36}
            fill={colors.primary}
          />
        </Rect>
      </Rect>
    </Rect>,
  );

  yield* all(showContent().height(DEFAULT, 2), showContent().scale(1, 0.35));

  yield* waitUntil("show_descriptions");

  for (let i = 0; i < descriptions.length; i++) {
    // @ts-ignore
    yield* type(1, () => descriptions[i], " - " + descriptionsText[i]);
  }

  yield* waitUntil("nix_flakes_outputs_show_end");

  yield* all(
    showContent().height(0, 1),
    delay(0.5, showContent().scale(0, 0.35)),
  );

  yield* waitFor(useDuration("nix_flakes_outputs_end"));
});
