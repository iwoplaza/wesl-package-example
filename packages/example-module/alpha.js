// @ts-check

/**
 * @typedef {object} F32
 * @prop {'f32'} kind
 */
const f32 = /**@type{F32}*/ ({
  kind: 'f32',
});

/**
 * @typedef {object} Vec3f
 * @prop {'vec3f'} kind
 */
const vec3f = /**@type{Vec3f}*/ ({
  kind: 'vec3f',
});

/**
 * @template T
 * @typedef {object} WgslStruct
 * @prop {'struct'} kind
 * @prop {T} props
 */
const struct = /**@type{<T>(props: T)=>WgslStruct<T>}*/ (
  (props) => ({
    kind: 'struct',
    props,
  })
);

export const half = /**@type{const}*/ ({
  type: 'f',
  args: [f32],
  returns: f32,
});

export const double = /**@type{const}*/ ({
  type: 'f',
  args: [f32],
  returns: f32,
});

export const add = /**@type{const}*/ ({
  type: 'f',
  args: [f32, f32],
  returns: f32,
});

export const Gradient = struct({
  from: vec3f,
  to: vec3f,
});
