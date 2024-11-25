// @ts-check

/**
 * @template TArgs,TReturns
 * @typedef {object} WgslFn
 * @prop {'fn'} type
 * @prop {TArgs} args
 * @prop {TReturns} returns
 * @prop {string=} label An explicit name given to this function
 * @prop {unknown} body
 */

/**
 * @typedef {object} Reference
 * @prop {string=} label An explicit name given to this resource
 */

/**
 * @typedef {object} LinkOptions
 * @prop {(Reference|string)[]} inputs
 */

/**
 * @param {LinkOptions} options
 * @returns {string} A raw WGSL string.
 */
export function link(options) {
  const { inputs } = options;

  // Holds identifiers given to already resolved references.
  const nameRegistry = /** @type {WeakMap<Reference, string>} */ (
    new WeakMap()
  );

  const result = '';

  return result;
}
