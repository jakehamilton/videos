import { Circle, Rect, RectProps } from "@motion-canvas/2d";

export interface ListProps extends RectProps {
  bulletFill?: string;
}

export default function List(props: ListProps) {
  return (
    <Rect
      layout
      justifyContent="start"
      alignItems="start"
      direction="column"
      gap={20}
      width="100%"
      height="100%"
      paddingLeft={80}
      paddingRight={80}
      {...props}
    />
  );
}
