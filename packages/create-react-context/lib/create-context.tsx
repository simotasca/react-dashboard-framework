import React from "react";

class ContextError extends Error {}

export function createContext<C = any>(p: { errorMsg?: string; initialValue?: C; initializer: () => C;}): 
  [React.Context<C | null>, () => C, (p: React.PropsWithChildren) => JSX.Element];

export function createContext<C = any>(p?: { errorMsg?: string; initialValue?: C; initializer?: never }): 
  [React.Context<C | null>, () => C, (p: React.PropsWithChildren<{ value: C }>) => JSX.Element];

export function createContext<C = any>(p) {
  const context = React.createContext<C | null>(p?.initialValue || null);
  const hook = () => {
    const value = React.useContext(context);
    if (value === null) throw new ContextError(p?.errorMsg ?? "cannot use context outside provider");
    return value;
  };
  const Provider = (p && p.initializer != undefined) 
    ? ({ children }: React.PropsWithChildren) => <context.Provider value={p.initializer()}>{children}</context.Provider>
    : ({ value, children }: React.PropsWithChildren<{ value: C }>) => <context.Provider value={value}>{children}</context.Provider> 
  return [context, hook, Provider];
}