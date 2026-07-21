import { Circle, Rect, RectProps } from "@motion-canvas/2d";
import * as colors from "~/util/colors";

export interface ListItemProps extends RectProps {
  bulletFill?: string;
}

export default function ListItem(props: ListItemProps) {
  const {
    bulletFill = colors.root.foreground,
    gap = 16,
    children,
    ...rest
  } = props;

  return (
    <Rect gap={gap} {...rest}>
      <Rect alignItems="center" height={48}>
        <Circle size={16} fill={bulletFill} />
      </Rect>
      {children}
    </Rect>
  );
}
