export type baseObject<T> = {
    [prop: PropertyKey]: T
}

export type anyFunction = (...args:any[]) => any

export type objectAny = baseObject<any>

export type objectUnknown = baseObject<unknown>

export type objectFunction = baseObject<anyFunction>






