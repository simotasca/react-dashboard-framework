import { useBoolean } from "../useBoolean";

export function usePasswordToggle(defaultShowPassowrd = false) {
  const [showPassword, setShowPassword, toggle] = useBoolean(defaultShowPassowrd);
  const inputType = showPassword ? ("text" as const) : ("password" as const);
  return [showPassword, setShowPassword, toggle, inputType] as const;
}
