import * as React from "react";
import { useSettings } from "../../contexts/ComponentsContext";

import { Label, LabelProps } from "../Label";
import { Hint, HintProps } from "../Hint";
import { Error, ErrorProps } from "../Error";
import { clsx } from "../../helpers";

enum HTMLValidationResult {
  VALID,
  MISSING,
  PATTERN_MISMATCH,
  TOO_SHORT,
  TOO_LONG,
  TOO_LOW,
  TOO_HIGH,
}

export type TextInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "prefix"
> & {
  id: string;
  name: string;
  ref?: React.Ref<HTMLInputElement>;

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

  formGroup?: {
    className?: string;
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
    formGroup,
    label,
    error,
    hint,
    type = "text",
    spellCheck = false,
    className,
    layoutOrder,
    style,
    prefix,
    suffix,
    onDomChange,
    onValidation,
    ...rest
  } = props;

  const labelElement = label ? <Label {...label} htmlFor={rest.id} /> : null;
  const hintElement = hint ? <Hint {...hint} id={`${rest.id}-hint`} /> : null;
  const errorElement = error ? (
    <Error {...error} id={`${rest.id}-error`} />
  ) : null;

  const {
    debug,
    inputClasses,
    inputErrorClasses,
    formGroupClasses,
    formGroupErrorClasses,
    inputLayoutOrder,
  } = useSettings();

  const classes = clsx(inputClasses, error && inputErrorClasses, className);
  const groupClasses = clsx(
    formGroupClasses,
    !!error && formGroupErrorClasses,
    formGroup?.className,
  );

  // Warn against common issues
  if (debug) {
    if (!rest["aria-label"] && !label) {
      console.warn("TextInput: Inputs must have a label or an aria-label.");
    }

    if (rest.placeholder && !label && !rest["aria-label"]) {
      console.warn(
        "TextInput: Placeholders should not be used as a replacement for labels.",
      );
    }
  }

  const order = layoutOrder ||
    inputLayoutOrder || ["label", "input", "hint", "error"];

  const hasHint =
    hint &&
    (order.includes("hint") || (order.includes("hintOrError") && !error));
  const hasError =
    error &&
    (order.includes("error") || (order.includes("hintOrError") && error));

  const describedBy =
    [
      hasHint ? `${rest.id}-hint` : undefined,
      hasError ? `${rest.id}-error` : undefined,
    ]
      .filter(Boolean)
      .join(" ") || undefined;

  const runHtmlValidations = (value: string) => {
    if (rest.required && !value) {
      onValidation?.(HTMLValidationResult.MISSING);
      return;
    }

    if (
      rest.pattern &&
      // NOTE: The "v" flag is the correct one to use, but it's yet widely supported.
      !new RegExp("^(?:" + rest.pattern + ")$", "u").test(value)
    ) {
      onValidation?.(HTMLValidationResult.PATTERN_MISMATCH);
      return;
    }

    if (rest.maxLength && value.length > rest.maxLength) {
      onValidation?.(HTMLValidationResult.TOO_LONG);
      return;
    }

    if (rest.minLength && value.length < rest.minLength) {
      onValidation?.(HTMLValidationResult.TOO_SHORT);
      return;
    }

    if (rest.min && Number(value) < Number(rest.min)) {
      onValidation?.(HTMLValidationResult.TOO_LOW);
      return;
    }

    if (rest.max && Number(value) > Number(rest.max)) {
      onValidation?.(HTMLValidationResult.TOO_HIGH);
      return;
    }

    onValidation?.(HTMLValidationResult.VALID);
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
      <div className="flex items-center relative">
        {prefix && <div className="absolute">{prefix.children}</div>}
        {input}
        {suffix && <div className="absolute right-0">{suffix.children}</div>}
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

  return (
    <div className={groupClasses}>
      {order.map((element) => elements[element])}
    </div>
  );
}

TextInput.displayName = "TextInput";
