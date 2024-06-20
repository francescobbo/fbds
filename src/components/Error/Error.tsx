import * as React from "react";
import { useContext } from "react";
import { ComponentsContext } from "../../contexts/ComponentsContext";

export type ErrorProps = {
  wrapper?: (props: { children: React.ReactNode }) => React.ReactElement;
  [key: `data-${string}`]: unknown;
} & React.LabelHTMLAttributes<HTMLDivElement>;

export function Error(props: ErrorProps) {
  const { children, className, wrapper, ...rest } = props;

  const { errorClasses } = useContext(ComponentsContext);
  const classes = `${errorClasses} ${className || ""}`.trim();

  const error = (
    <div className={classes} {...rest}>
      {children}
    </div>
  );

  return wrapper ? wrapper({ children: error }) : error;
}
