/**
 * @type JSXProperties
 * @since 0.1.0
 */
export type JSXProperties<TProps, TEvent = any> = Partial<TProps & TEvent & { ref: any }>