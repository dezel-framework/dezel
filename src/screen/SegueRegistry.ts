import { Segue } from 'screen/Segue'

/**
 * The segue registry by name.
 * @const SegueRegistry
 * @since 0.1.0
 */
export const SegueRegistry: Map<string, typeof Segue> = new Map()