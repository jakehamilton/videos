import { Circle, makeScene2D, Rect } from "@motion-canvas/2d";
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
} from "@motion-canvas/core";
import { insert } from "@motion-canvas/2d/lib/components/CodeBlock";
import { Txt } from "~/components/txt";
import * as colors from "~/util/colors";
import { swoop, swoopTitle } from "~/util/transform";

export const TITLE_POSITION = new Vector2(80, 80);
export const TITLE_FONT_SIZE = 80;

export const CONTENT_GAP = 24;

export default makeScene2D(function*(view) {
	view.fill(colors.root.background);

	const title = createRef<Txt>();

	view.add(
		<Txt ref={title} bold position={[0, 0]} fontSize={64}>
			Nix
		</Txt>,
	);

	yield* waitUntil("nix_definition");

	yield* swoopTitle(title);

	const titleSize = title().size();

	const definition = createRef<Txt>();

	view.add(<Txt ref={definition} text={""} textWrap maxWidth={1200} />);

	yield* tween(8, (value) => {
		definition().text(
			textLerp(
				definition().text(),
				"Nix is a generic build tool that allows you to create packages declaratively with reproducibility guarantees.",
				easeInOutSine(value),
			),
		);
	});

	const definitionPosition = TITLE_POSITION.transformAsPoint(
		definition().worldToLocal(),
	).add(new Vector2(0, CONTENT_GAP + titleSize.y));
	const definitionSize = definition().size();

	yield waitUntil("nix_definition_list");

	yield* all(
		swoop(definition, {
			x: definitionPosition.x + definitionSize.x / 2,
			y: definitionPosition.y + definitionSize.y / 2,
		}),
	);

	const list = createRef<Rect>();
	const items = [
		"Builds packages",
		"Uses a declarative language",
		"Reproducible builds",
	];

	view.add(
		<Rect
			layout
			ref={list}
			justifyContent="start"
			alignItems="start"
			direction="column"
			gap={20}
			grow={1}
			width="100%"
			height="100%"
			paddingTop={
				definition().absolutePosition().y + definitionSize.y + CONTENT_GAP
			}
			paddingLeft={80}
			paddingRight={80}
		/>,
	);

	for (let i = 0; i < items.length; i++) {
		const item = items[i];
		yield* waitUntil(`nix_definition_list_item_${i}`);

		const text = createRef<Txt>();

		list().insert(
			<Rect gap={16}>
				<Rect alignItems="center" height={48}>
					<Circle size={16} fill={colors.root.foreground} />
				</Rect>
				<Txt ref={text} text={""} textWrap maxWidth={1200} />
			</Rect>,
			i,
		);
		yield* tween(1, (value) => {
			text().text(textLerp("", item, easeInOutSine(value)));
		});
	}

	yield* waitFor(1.5);
});
