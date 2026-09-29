/**
 * dsh-mode-intro-card-super — host half.
 *
 * Marker row only: the bundle patch mounts it so this package's client half
 * loads. The preset itself is declared by
 * `presets/superfatfish/preset.patch.yml`, and the browser half owns the
 * opening card plus the hidden preheat round.
 */

export const name = 'mode-intro-card-super'

/** The client declaration and bundle patch own all behavior. */
export function apply() {}
