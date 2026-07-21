import {
  type Txt as MotionCanvasTxtType,
  Txt as MotionCanvasTxt,
  TxtProps as MotionCanvasTxtProps,
} from "@motion-canvas/2d";

import * as colors from "~/util/colors";

export interface TxtProps extends MotionCanvasTxtProps {
  bold?: boolean;
}

export function Txt(props: TxtProps) {
  const {
    fontFamily = "Nunito",
    fill = colors.root.foreground,
    ...rest
  } = props;

  const fontWeight = props.bold ? "bold" : rest.fontWeight ?? "normal";

  return (
    <MotionCanvasTxt
      {...props}
      fontFamily={fontFamily}
      // @ts-ignore
      fontWeight={fontWeight}
      fill={fill}
    />
  );
}

export type Txt = MotionCanvasTxtType;
