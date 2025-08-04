import * as React from "react";

// reference: https://fettblog.eu/typescript-react-generic-forward-refs/
declare module "react" {
  function forwardRef<T, P = {}>(
    render: (props: P, ref: React.Ref<T>) => React.ReactNode | null
  ): (props: P & React.RefAttributes<T>) => React.ReactNode | null;

  type PWC<P = unknown> = PropsWithChildren<P>;

  type StateSetter<T> = React.Dispatch<React.SetStateAction<T>>;

  type HTMLElProps<T> = DetailedHTMLProps<HTMLAttributes<T>, T>;

  type TableElProps = DetailedHTMLProps<TableHTMLAttributes<HTMLTableElement>, HTMLTableElement>;
  type TableCellProps = DetailedHTMLProps<TdHTMLAttributes<HTMLTableDataCellElement>, HTMLTableDataCellElement>;
  type InputElProps = HTMLElProps<HTMLInputElement, React.InputHTMLAttributes>;
  type SelectElProps = HTMLElProps<HTMLSelectElement, React.SelectHTMLAttributes>;
}
