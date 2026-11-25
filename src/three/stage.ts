/**
 * Per-frame derived pose shared by everything on stage (3D can, photo stage,
 * light effects). Computed once per frame by <StageDriver/> before other frame callbacks.
 */
export const stage = {
  x: 0,
  y: 0,
  z: 0,
  s: 1.5,
  /** world-space height of the 3D → photo hand-off line */
  edgeY: -10,
  tiltX: 0,
  tiltY: 0,
  time: 0,
  /** 0..1 how light the current background is */
  lightness: 0,
};

/** the 3D can model spans y ∈ [-0.5, 0.5] at scale 1 */
export const CAN_RADIUS = 0.1912;
