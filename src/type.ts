// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type renderType<ARGS extends any[] = any[], RES = any> = (...args: ARGS) => RES
