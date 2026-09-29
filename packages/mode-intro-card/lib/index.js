/**
 * dsh-mode-intro-card — host half.
 *
 * Marker row only: the bundle patch mounts it so this package's client half
 * loads. The preset itself is declared by `presets/mypersona/preset.patch.yml`,
 * and the browser half owns the opening card.
 */

export const name = 'mode-intro-card'

/** The client declaration and bundle patch own all behavior. */
export function apply() {}
