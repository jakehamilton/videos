import { Rect, RectProps } from "@motion-canvas/2d";

export interface ContentProps extends RectProps {}

export default function Content({ ...rest }: ContentProps) {
  return (
    <Rect
      layout
      justifyContent="start"
      alignItems="start"
      direction="column"
      grow={1}
      width="100%"
      height="100%"
      paddingTop={200}
      {...rest}
    />
  );
}
