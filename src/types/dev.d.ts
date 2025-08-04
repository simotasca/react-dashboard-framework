// https://stackoverflow.com/questions/57683303/how-can-i-see-the-full-expanded-contract-of-a-typescript-type
type Prettify<T> = T extends (...args: infer A) => infer R
  ? (...args: Prettify<A>) => Prettify<R>
  : T extends object
  ? T extends infer O
    ? { [K in keyof O]: Prettify<O[K]> }
    : never
  : T;