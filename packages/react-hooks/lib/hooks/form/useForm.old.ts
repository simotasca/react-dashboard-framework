import { useState } from "react";
import { z } from "zod";
import { useObjectState } from "../useObject";

/**
 * TODO:
 * [~] prendere i default dal validator
 * [ ] valutare proprietà di oggetti nested (potrebbe essere un limite accettabile)
 * [ ] JSDOC su use form
 * [x] far funzionare con headlessui o altri componenti custom
 */

type SubmitHandler<T extends z.ZodType> = {
  (data: z.infer<T>): void | Promise<void>;
};
export type RegisterFunction<C> = (name: keyof C) => {
  "data-form-error"?: string;
  onChange(e: any): void;
  value: any;
  disabled?: boolean;
};
export type ControlFunction<C> = {
  <K extends keyof C>(field: K): {
    setValue: (v: C[K]) => void;
    value: Partial<C>[K];
    loading: boolean;
    error?: z.ZodIssue;
  };
};

type UseFormOptions<ValidatorInput> = {
  initialValues?: Partial<ValidatorInput>;
};

export function useForm<
  A extends z.ZodRawShape,
  Catchall extends z.ZodTypeAny,
  Input = z.objectInputType<A, Catchall, z.UnknownKeysParam>,
  // Output = z.objectOutputType<A, Catchall, z.UnknownKeysParam>
>(validator: z.ZodObject<A> | z.ZodEffects<z.ZodObject<A>>, options?: UseFormOptions<Input>) {
  const { value: fields, set: setField } = useObjectState<Partial<Input>>(options?.initialValues || getDefaults(validator) || {});
  const [loading, setLoading] = useState(false);
  const { value: errors, setValue: setErrors, get: getError } = useObjectState<{ [key: string | number | symbol]: z.ZodIssue | undefined }>({});
  const register: RegisterFunction<Input> = (name: keyof Input) => {
    return {
      "data-invalid": getError(name)?.message,
      value: fields[name] || "",
      checked: !!fields[name] || false,
      disabled: loading,
      onChange: (e) => {
        if (e && e._reactName === "onChange") {
          let value: any;
          switch (e.target.type) {
            case "checkbox":
              value = e.target.checked;
              break;
            case "number":
              value = e.target.valueAsNumber;
              break;
            case "date":
              value = e.target.value;
              break;
            default:
              value = e.target.value;
              break;
          }
          setField(name, value);
        } else {
          setField(name, e);
        }
        setErrors((prev) => {
          delete prev[name];
          return prev;
        });
      },
    };
  };

  function handleSubmit(fn: SubmitHandler<typeof validator>) {
    let errorHandler: ((errors: { [key: string]: z.ZodIssue }) => void | Promise<void>) | undefined;
    const handler = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const result = validator.safeParse(fields);
      setErrors({});
      if (result.error) {
        let newErrors: { [key: string]: z.ZodIssue } = {};
        result.error.issues.forEach((issue) => {
          issue.path.forEach((path) => (newErrors[path] = issue));
        });
        setErrors(newErrors);
        errorHandler && (await errorHandler(newErrors));
        return;
      }
      setLoading(true);
      await fn(result.data);
      setLoading(false);
    };

    handler.onInvalid = function (errFn?: (errors: { [key: string]: z.ZodIssue }) => void | Promise<void>) {
      errorHandler = errFn;
      return handler;
    };
    return handler;
  }

  const control: ControlFunction<Input> = <K extends keyof Input>(field: K) => ({
    setValue: (v: Input[K]) => setField(field, v),
    value: fields[field],
    error: getError(field),
    loading,
  });

  return { register, control, handleSubmit, errors, loading, fields };
}

function getDefaults<Schema extends z.AnyZodObject | z.ZodEffects<z.AnyZodObject>>(schema: Schema) {
  const shape = "shape" in schema ? schema.shape : schema._def.schema.shape;
  return Object.fromEntries(
    Object.entries(shape).map(([key, value]) => {
      if (value instanceof z.ZodDefault) return [key, value._def.defaultValue()];
      return [key, undefined];
    })
  ) as any;
}
