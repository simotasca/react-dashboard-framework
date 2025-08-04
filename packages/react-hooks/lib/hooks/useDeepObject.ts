import { useState } from "react";

type Setter<T> = <K extends keyof T>(key: K, val: T[K]) => void;
type Getter<T> = <K extends keyof T>(key: K) => T[K];

type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

function isObject(item: any): boolean {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

function mergeDeep(target, ...sources) {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return mergeDeep(target, ...sources);
}

export function useDeepObject<T extends object>(initial: T | (() => T)) {
  const [value, setValue] = useState<T>(initial);
  const merge = (partialValue: RecursivePartial<T>) => setValue(prev => mergeDeep({...prev}, partialValue));
  const set: Setter<T> = <K extends keyof T>(key: K, val: T[K]) => setValue(prev => ({ ...prev, [key]: val }));
  const setter = <K extends keyof T>(key: K) => (val: T[K]) => setValue(prev => ({ ...prev, [key]: val }));
  const deepSet = <P extends PathsOf<T, true>>(path: P, val: ValueAtPath<T, P>) => setValue(prev => setNestedValue(prev, path as any, val));
  const get: Getter<T> = <K extends keyof T>(key: K): T[K] => value[key];

  return { value, setValue, merge, set, setter, deepSet, get };
}

type CombineAll<T> = T extends {[name in keyof T]: infer Type} ? Type : never

type PropertyNameMap<T, IncludeIntermediate extends boolean> = {
    [name in keyof T]: T[name] extends object ? (
        SubPathsOf<name, T, IncludeIntermediate> | (IncludeIntermediate extends true ? name : never) 
    ) : name
}

type SubPathsOf<key extends keyof T, T, IncludeIntermediate extends boolean> = (
    `${string & key}.${string & PathsOf<T[key], IncludeIntermediate>}`
)

export type PathsOf<T, IncludeIntermediate extends boolean = false> = CombineAll<PropertyNameMap<T,IncludeIntermediate>>


type ValueAtPath<T, P extends PathsOf<T, true>> = 
  P extends `${infer K}.${infer Rest}` ? (
    /** @ts-ignore */
      K extends keyof T ? ValueAtPath<T[K], Rest> : never
  ) : P extends keyof T ? T[P] : never;


function setNestedValue(obj: object, path: string, value: any): any {
  let schema = obj;  // a moving reference to internal objects within obj
  if(!obj) throw new Error("ERROR setNetedValue does not allow null or undefined objects");
  if(typeof obj != "object") throw new Error("ERROR only object types allowed in setNetedValue");
  let pList = path.split('.');
  let len = pList.length;
  for(let i = 0; i < len-1; i++) {
      let elem = pList[i];
      if(!schema[elem]) schema[elem] = {}
      schema = schema[elem];
  }

  schema[pList[len-1]] = value;

  return obj;
}