// see src/lib/globals.ts

export {}

declare global {
  interface Document {
    $: typeof document.querySelector;
    $$: typeof document.querySelectorAll;
  }
}
