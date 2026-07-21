import { Line, LineProps } from "@motion-canvas/2d";
import * as colors from "~/util/colors";

export interface ArrowProps extends LineProps {}

export default function Arrow(props: ArrowProps) {
  return (
    <Line
      stroke={colors.root.foreground}
      lineWidth={8}
      lineCap="round"
      endArrow
      {...props}
    />
  );
}
