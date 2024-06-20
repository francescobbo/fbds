import * as React from "react";
import { useSettings } from "../../contexts/ComponentsContext";

import { Label, LabelProps } from "../Label";
import { Hint, HintProps } from "../Hint";
import { Error, ErrorProps } from "../Error";
import { HTMLValidationResult, clsx } from "../../helpers";

import { htmlValidations } from "../../helpers";

export type TextInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "prefix"> & {
  ref?: React.Ref<HTMLInputElement>;

  id: string;
  name: string;

  /**
   * Class names to be applied to the input element.
   */
  className?: string | undefined;

  /**
   * Class names to be applied to the input element when an error is present.
   */
  errorClassName?: string | undefined;

  /**
   * The type of the input.
   *
   * @default "text"
   */
  type?: React.InputHTMLAttributes<HTMLInputElement>["type"];

  /**
   * Whether the input should have spell check enabled.
   * When this is not set, the browser's may enable or disable spell check based on heuristics.
   * The `false` default value ensures that spell check is not enabled unexpectedly.
   *
   * @default false
   */
  spellCheck?: boolean;

  /**
   * Settings for the element that wraps the component, including the label, input, hint, and error.
   */
  container?: {
    /**
     * Class names to be applied to the form group element.
     */
    className?: string;

    /**
     * Class names to be applied to the form group element when an error is present.
     */
    errorClassName?: string;
  };

  label?: LabelProps;
  error?: ErrorProps;
  hint?: HintProps;

  prefix?: {
    children: React.ReactNode;
    inline?: boolean;
  };

  suffix?: {
    children: React.ReactNode;
    inline?: boolean;
  };

  /**
   * The order in which the elements should be rendered.
   */
  layoutOrder?: ("label" | "input" | "hint" | "error" | "hintOrError")[];

  /**
   * A simulated `onChange` event that fires like a native `onChange` event.
   * (onBlur with a value change, or Enter key press)
   */
  onDomChange?: (e: React.FormEvent<HTMLInputElement>) => void;

  /**
   * A callback that fires when the input is validated against the HTML validation constraints.
   * It is called with the result of the validation. @see `HTMLValidationResult`
   * The consumer should use this to update the `error` prop.
   * This is fired:
   * - When the input is blurred
   * - When the Enter key is pressed while the input is focused
   * - When the form is submitted (this may also trigger the onBlur event)
   */
  onValidation?: (error: HTMLValidationResult) => void;

  [key: `data-${string}`]: unknown;
};

/**
 * An unopinionated, unstyled, accessible, flexible text input component.
 *
 * Using this component directly is not recommended. Use it in your own component library instead.
 */
export function TextInput(props: TextInputProps) {
  const {
    container,
    label,
    error,
    hint,
    type = "text",
    spellCheck = false,
    className,
    errorClassName,
    layoutOrder,
    prefix,
    suffix,
    onDomChange,
    onValidation,
    ...rest
  } = props;

  const labelElement = label ? <Label key="label" {...label} htmlFor={rest.id} /> : null;
  const hintElement = hint ? <Hint key="hint" {...hint} id={`${rest.id}-hint`} /> : null;
  const errorElement = error ? <Error key="error" {...error} id={`${rest.id}-error`} /> : null;

  const { debug } = useSettings();

  const classes = clsx(className, error && errorClassName);
  const containerClasses = clsx(container?.className, error && container?.errorClassName);

  // Warn against common issues
  if (debug) {
    if (!rest["aria-label"] && !label) {
      console.warn("TextInput: Inputs must have a label or an aria-label.");
    }

    if (rest.placeholder && !label && !rest["aria-label"]) {
      console.warn("TextInput: Placeholders should not be used as a replacement for labels.");
    }
  }

  const order = layoutOrder || ["label", "input", "hint", "error"];

  const hasHint = hint && (order.includes("hint") || (order.includes("hintOrError") && !error));
  const hasError = error && (order.includes("error") || order.includes("hintOrError"));

  const describedBy =
    [hasHint ? `${rest.id}-hint` : undefined, hasError ? `${rest.id}-error` : undefined]
      .filter(Boolean)
      .join(" ") || undefined;

  const runHtmlValidations = (value: string) => {
    if (!onValidation) {
      return;
    }

    onValidation(htmlValidations(value, rest));
  };

  const [lastValue, setLastValue] = React.useState(rest.value);

  const handleValueChange = (e: React.FormEvent<HTMLInputElement>) => {
    onDomChange?.(e);
    runHtmlValidations(e.currentTarget.value);
    setLastValue(e.currentTarget.value);
  };

  const onInvalid = (e: React.FormEvent<HTMLInputElement>) => {
    runHtmlValidations(e.currentTarget.value);
    rest.onInvalid?.(e);
  };

  const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (lastValue !== e.target.value) {
      handleValueChange(e);
    }

    rest.onBlur?.(e);
  };

  const onKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && lastValue !== e.currentTarget.value) {
      handleValueChange(e);
    }

    rest.onKeyUp?.(e);
  };

  const input = (
    <input
      key="input"
      type={type}
      className={classes}
      spellCheck={spellCheck}
      aria-describedby={describedBy}
      aria-invalid={!!error}
      onBlur={onBlur}
      onInvalid={onInvalid}
      onKeyUp={onKeyUp}
      {...rest}
    />
  );

  const inputWithPrefixSuffix =
    ((prefix || suffix) && (
      <div className="">
        {prefix?.children}
        {input}
        {suffix?.children}
      </div>
    )) ||
    input;

  const elements = {
    label: labelElement,
    hint: hintElement,
    error: errorElement,
    hintOrError: error ? errorElement : hintElement,
    input: inputWithPrefixSuffix,
  };

  return <div className={containerClasses}>{order.map((element) => elements[element])}</div>;
}

TextInput.displayName = "TextInput";
