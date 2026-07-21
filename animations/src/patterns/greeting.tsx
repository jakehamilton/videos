import { View2D } from "@motion-canvas/2d";
import { createRef, waitFor, waitUntil } from "@motion-canvas/core";
import { Txt } from "~/components/txt";
import { type } from "~/util/text";

export default function* greeting(view: View2D) {
  const text = createRef<Txt>();

  view.add(<Txt ref={text} bold fontSize={64}></Txt>);

  yield* waitUntil("greeting_start");

  yield* type(0.5, text, "Hey there!");

  yield* waitUntil("greeting_end");

  yield* type(0.5, text, "");

  text().remove();
}
