import { forwardRef } from "react";
import Slide from "@mui/material/Slide";
import type { TransitionProps } from "@mui/material/transitions";

export const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});
