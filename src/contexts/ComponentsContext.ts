import { createContext, useContext } from "react";
import { TextInputProps } from "../components";

const defaultValue = {
  debug: false,
  errorClasses: "fbds-error",
  hintClasses: "fbds-hint",
  formGroupClasses: "fbds-form-group",
  formGroupErrorClasses: "fbds-form-group--error",
  inputClasses: "fbds-input",
  inputErrorClasses: "fbds-input--error",
  labelClasses: "fbds-label",

  inputLayoutOrder: ["label", "input", "hint", "error"] as TextInputProps["layoutOrder"],
  handleHtmlValidations: true,
}

type ComponentsContextType = Partial<typeof defaultValue>;

export const ComponentsContext = createContext<ComponentsContextType>(defaultValue);

export function useSettings() {
  const context = useContext(ComponentsContext);

  return {
    ...defaultValue,
    ...context,
  };
}