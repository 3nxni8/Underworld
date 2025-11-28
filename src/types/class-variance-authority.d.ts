declare module 'class-variance-authority' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export type VariantProps<T extends (...args: any) => any> = Omit<
    OmitUndefined<Parameters<T>[0]>,
    "class" | "className"
  >;
  
  type OmitUndefined<T> = T extends undefined ? never : T;
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export function cva(base?: string, config?: any): (...args: any[]) => string;
}
