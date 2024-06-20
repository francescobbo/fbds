import * as React from "react";
import { useContext } from "react";
import { ComponentsContext } from "../../contexts/ComponentsContext";

export type LabelProps = {
  wrapper?: (props: { children: React.ReactNode }) => React.ReactElement;
  [key: `data-${string}`]: unknown;
} & React.LabelHTMLAttributes<HTMLLabelElement>;

export function Label(props: LabelProps) {
  const { children, wrapper, ...rest } = props;

  const { labelClasses } = useContext(ComponentsContext);
  const classes = `${labelClasses} ${rest.className || ""}`.trim();

  const label = (
    <label {...rest} className={classes}>
      {children}
    </label>
  );

  return wrapper ? wrapper({ children: label }) : label;
}
