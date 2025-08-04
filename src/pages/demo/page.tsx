import { Compact } from "@/components/ui/display/Compact";
import { Badge } from "@/components/ui/elements/Badge";
import { Text } from "@/components/ui/elements/Text";
import { Button } from "@/components/ui/elements/buttons/Button";
import * as f from "@/components/ui/form";
import { Switch } from "@/components/ui/form/inputs/switch";
import * as i from "@/components/ui/icons";
import { Tooltip, useBaseTooltip } from "@/components/ui/overlays/tooltip";
import { useNotification } from "@/context/notification";
import { sleep } from "@/lib/promises";
import { api } from "@/pages/demo/demo-api";
import { useForm, usePasswordToggle } from "@quarto-raggio/react-hooks/form";
import { useState } from "react";
import { z } from "zod";

const selectValues = ["uno", "doie", "true", "quatto", "no"] as const;

// questi default creano dei problemi con l'interfaccia... se passo undefined da interfaccia comunque qui valorizzo col default...
const validator = z
  .object({
    email: z.string().email().min(1, "Required").default("simo.tasca@gmail.com"),
    password: z
      .string()
      // 1 maiuscola, 1 numbero, 1 carattere tra: @ $ ! % * ? & . , : ; _ -
      .regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.,:;_-])/)
      .min(6, "Too short")
      .min(1, "Required")
      .default("Demo123!"),
    select: z.enum(selectValues, { message: "Creation is denied" }).refine((val) => val != "quatto", "quatto is invalid"),
    unadate: z
      .string()
      .refine((d) => !Number.isNaN(Date.parse(d)), "Invalid date")
      .transform((d) => new Date(d)),
    isTrue: z.boolean().optional().default(true),
    isTrueConfirm: z.boolean().optional().default(false),
  })
  .superRefine((obj, ctx) => {
    if (obj.isTrue !== obj.isTrueConfirm) {
      ctx.addIssue({ code: "custom", path: ["isTrueConfirm"], message: "Should match" });
    }
  });

// handle initial values
export function DemoPage() {
  const { notify } = useNotification();
  const [showPassword, , togglePw, pwType] = usePasswordToggle();
  const { register, handleSubmit, errors, loading } = useForm(validator);
  const [create, setCreate] = useState(false);

  const [comboButton, comboTooltip] = useBaseTooltip();

  const onSubmit = handleSubmit(async (formData) => {
    console.log("VALID FORM DATA:", formData);
    await sleep(2000); // for the drama
    await api.posts
      .list()
      .then((res) => {
        notify("success", "Form saved successfully");
        console.log(res.body);
      })
      .catch((err) => {
        notify("error", "An error occurred saving form data");
        console.error("ERROR fetching posts list:", err);
      });
  }).onInvalid(async (errors) => {
    notify("warning", "An error occurred validating form data");
    console.warn("ERROR validating form data:", errors);
  });

  return (
    <>
      <div className="flex flex-wrap gap-x-4 gap-y-1 mb-4">
        <StatusElement color="green" status="active" text="5 elements" />
        <StatusElement color="yellow" status="waiting" text="0 elements" />
        <StatusElement color="red" status="disabled" text="2 elements" />
      </div>

      <form onSubmit={onSubmit} className="max-w-80 space-y-6 my-8">
        <f.Field>
          <f.Label>Email *</f.Label>
          <f.Description>{errors.email?.message}</f.Description>
          <f.InputGroup>
            <i.EnvelopeIcon />
            <f.Input {...register("email")} />
          </f.InputGroup>
          <f.Description>Questa email deve è una mail</f.Description>
        </f.Field>

        <f.Field>
          <f.Label>Password *</f.Label>
          <f.Description>{errors.password?.message || "Lorem ipsum dolor?"}</f.Description>
          <Compact>
            <f.InputGroup>
              <i.LockClosedIcon />
              <f.Input {...register("password")} type={pwType} />
            </f.InputGroup>
            <Button color="indigo" onClick={togglePw} disabled={loading}>
              {showPassword ? <i.EyeIcon /> : <i.EyeSlashIcon />}
            </Button>
          </Compact>
          <f.Description>Passwords must contain at least 1 Uppercase letter, 1 number and 1 special character</f.Description>
        </f.Field>

        <f.Field>
          <f.Label>Date *</f.Label>
          <f.Description>{errors.unadate?.message}</f.Description>
          <f.Input {...register("unadate")} type="date" />
          <f.Description>Scegli la data che vuoi!</f.Description>
        </f.Field>

        <f.Field>
          <f.Label>Combox demo</f.Label>
          <f.Description>{errors.select?.message || (create ? "create mode" : "select mode")}</f.Description>
          <Compact>
            {create ? (
              <f.Input {...register("select")} placeholder="custom value . . ." />
            ) : (
              <f.Select {...register("select")}>
                {selectValues.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </f.Select>
            )}

            <Button {...comboButton} className="group" color="indigo" onClick={() => setCreate((c) => !c)} disabled={loading}>
              {!create ? <i.PencilSquareIcon /> : <i.ArrowUturnLeftIcon />}
              <Tooltip {...comboTooltip} className="invisible group-hover:visible">
                {create ? "select" : "create new"}
              </Tooltip>
            </Button>
          </Compact>
        </f.Field>

        <div className="space-y-4">
          <f.SwitchField>
            <f.Label data-slot="label">Do you want it?</f.Label>
            <Switch {...register("isTrue")} />
          </f.SwitchField>

          <f.SwitchField>
            <f.Label>Sei sicuro?</f.Label>
            <Switch {...register("isTrueConfirm")} />
            <f.Description>
              Confirm that you <u>REALLY</u> want it?
            </f.Description>
          </f.SwitchField>
        </div>

        <Text light>Siffatta form è questa, con troppe librerie</Text>

        <Button type="submit" color="indigo" disabled={loading}>
          {loading ? <i.ProgressIcon className="animate-spin" /> : <i.ArrowRightIcon />}
          submit
        </Button>
      </form>
    </>
  );
}

function StatusElement(p: { text: string; status: string; color: React.ComponentProps<typeof Badge>["color"] }) {
  return (
    <div className="flex gap-x-2">
      <Badge color={p.color}>{p.status}</Badge>
      <Text>{p.text}</Text>
    </div>
  );
}
