import * as React from "react";
import { useContext } from "react";
import { ComponentsContext } from "../../contexts/ComponentsContext";

export type HintProps = {
  wrapper?: (props: { children: React.ReactNode }) => React.ReactElement;
  [key: `data-${string}`]: unknown;
} & React.LabelHTMLAttributes<HTMLDivElement>;

export function Hint(props: HintProps) {
  const { children, wrapper, ...rest } = props;

  const { hintClasses } = useContext(ComponentsContext);
  const classes = `${hintClasses} ${rest.className || ""}`.trim();

  const hint = (
    <div {...rest} className={classes}>
      {children}
    </div>
  );

  return wrapper ? wrapper({ children: hint }) : hint;
}
