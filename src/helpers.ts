export function clsx(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

export enum HTMLValidationResult {
  VALID,
  MISSING,
  PATTERN_MISMATCH,
  TOO_SHORT,
  TOO_LONG,
  TOO_LOW,
  TOO_HIGH,
}

export function htmlValidations(value: string, attributes: React.InputHTMLAttributes<HTMLInputElement>) {
    if (attributes.required && !value) {
      return HTMLValidationResult.MISSING
    }

    if (
      attributes.pattern &&
      // NOTE: The "v" flag is the correct one to use, but it's yet widely supported.
      !new RegExp("^(?:" + attributes.pattern + ")$", "u").test(value)
    ) {
      return HTMLValidationResult.PATTERN_MISMATCH
    }

    if (attributes.maxLength && value.length > attributes.maxLength) {
      return HTMLValidationResult.TOO_LONG
    }

    if (attributes.minLength && value.length < attributes.minLength) {
      return HTMLValidationResult.TOO_SHORT
    }

    if (attributes.min && Number(value) < Number(attributes.min)) {
      return HTMLValidationResult.TOO_LOW
    }

    if (attributes.max && Number(value) > Number(attributes.max)) {
      return HTMLValidationResult.TOO_HIGH
    }

    return HTMLValidationResult.VALID
}