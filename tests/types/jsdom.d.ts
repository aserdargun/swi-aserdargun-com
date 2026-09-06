declare module 'jsdom' {
  interface JSDOMOptions {
    runScripts?: 'dangerously'
    url?: string
  }

  export class JSDOM {
    readonly window: Window

    constructor(markup: string, options?: JSDOMOptions)
  }
}
