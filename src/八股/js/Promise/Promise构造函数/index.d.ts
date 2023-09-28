export type Executor = (resolve: Resolve, reject: Reject) => any
export type Resolve = <T>(value: T) => any
export type Reject = <T>(reason: T) => any
export type Then = (onFulfilled: OnFulfilled, onRejected: OnRejected) => any
export type OnFulfilled = () => any
export type OnRejected = () => any