type PreElementProps = React.HTMLElProps<HTMLPreElement>;
type JsonReplacer = Parameters<typeof JSON.stringify>[1];
type JsonProps = { val: any, space?: string | number, replacer?: JsonReplacer } & PreElementProps;

export function Json(p: JsonProps) {
  const { val, space, replacer, ...preProps } = p
  return <pre {...preProps}>
    {JSON.stringify(p.val, p.replacer || null, p.space || 4)}
  </pre>;
}
