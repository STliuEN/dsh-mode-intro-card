/**
 * dsh-mode-intro-card — host half.
 *
 * Marker row only: the card itself is pure client UI (the `dsh.client`
 * bundle). No host-side services, routes, or tools. The host entry exists so
 * the composition row activates and the client module registry picks the
 * package up as a `dsh.client` entry.
 */

export const name = 'mode-intro-card'

/** No host-side services; the client half owns the surface. */
export function apply() {}
