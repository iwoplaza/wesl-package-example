// @ts-check

import { isWgslStruct, isWgslFn } from 'wgsl-as-js';

/**
 * @template T
 * @typedef {import('wgsl-as-js').Infer<T>} Infer
 */

/**
 * @typedef {object} Reference
 * @prop {string=} label An explicit name given to this resource
 */

/**
 * @typedef {object} LinkOptions
 * @prop {(Reference|string)[]} input
 */

/**
 * @typedef {object} LinkContext
 * @prop {(val: string) => void} append
 * @prop {(val: *) => string} resolve
 * @prop {(primer: string|undefined) => string} uniqueName
 */

const fallthroughTypes = ['string', 'number', 'boolean'];

/**
 * @param {LinkOptions} options
 * @returns {string} A raw WGSL string.
 */
export function link(options) {
  // Holds code strings of already resolved references.
  const cachedResolves = /** @type {WeakMap<*, string>} */ (new WeakMap());

  let result = '';
  let nextUniqueIdx = 0;

  /** @type {LinkContext} */
  const ctx = {
    append(val) {
      result += val;
    },

    uniqueName(primer) {
      return `${primer ?? 'item'}_${nextUniqueIdx++}`;
    },

    resolve(value) {
      if (value === undefined) {
        return '';
      }

      let resolved = cachedResolves.get(value);
      if (resolved !== undefined) {
        return resolved;
      }

      if (fallthroughTypes.includes(typeof value)) {
        resolved = String(value);
      } else if (Array.isArray(value)) {
        resolved = value.map((el) => ctx.resolve(el)).join('');
      } else if (isWgslFn(value)) {
        const identifier = ctx.uniqueName(value.label);

        for (const arg of value.argTypes) {
          ctx.resolve(arg); // including the definitions of each arg type
        }
        ctx.resolve(value.returnType); // including the definition of the return type
        const body = ctx.resolve(value.body);

        ctx.append(`fn ${identifier}${body}\n\n`);

        resolved = identifier;
      } else if (isWgslStruct(value)) {
        const identifier = ctx.uniqueName(value.label);
        const members = Object.entries(value.propTypes)
          .map(([key, type]) => `  ${key}: ${ctx.resolve(type)},`)
          .join('\n');
        ctx.append(`struct ${identifier} {\n${members}\n}\n\n`);
        resolved = identifier;
      } else if ('type' in value) {
        resolved = /** @type {string} */ (value.type);
      } else {
        throw new Error(`Unknown resource type: ${JSON.stringify(value)}`);
      }

      if (typeof value === 'object') {
        cachedResolves.set(value, resolved);
      }
      return resolved;
    },
  };

  for (const input of options.input) {
    ctx.resolve(input);
  }

  return result;
}
