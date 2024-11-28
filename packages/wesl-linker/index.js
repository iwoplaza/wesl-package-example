/* [lee] nifty! 
  I think the ability to control shader assembly from TypeScript is powerful. 

  Beyond this simple example, I can imagine the flexibilty of TypeScript control
  will be valuable to advanced users who want to plug in different functions
  or modules under control of TypeScript so they control linking at runtime
  e.g. to plugin in different features in response to user settings, 
  or platform feature detection.

  We imagine some such control from WESL, via conditions and generics, both
  of which can be controlled at runtime.

  But we want to be able to control linking from TypeScript too, sometimes
  a declarative WESL approach isn't enough. @link is one design sketch in that direction.

  My hope is that we can find ways so that the TypeScript controls and the WGSL linking
  controls are convergent. e.g. conditions and generics and perhaps some variant of @link
  that can be set both from TypeScript and WESL.
*/

// @ts-check

/**
 * @template T
 * @typedef {T extends { __value: infer TValue } ? TValue : never} ValueOf
 */

/**
 * @template T
 * @typedef {T extends Record<string, unknown> ? { [Key in keyof T]: ValueOf<T[Key]> } : never} ValueOfRecord
 */

/**
 * @template T
 * @typedef {object} WgslStruct
 * @prop {'struct'} type
 * @prop {T} props
 * @prop {string=} label An explicit name given to this struct
 */

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
 * @prop {(Reference|string)[]} input
 */

/**
 * @typedef {object} LinkContext
 * @prop {(val: string) => void} append
 * @prop {(val: *) => string} resolve
 * @prop {(primer: string|undefined) => string} uniqueName
 */

/**
 * @param {*} value
 * @return {value is WgslFn<*, *>}
 */
function isFunction(value) {
  return value?.type === 'fn';
}

/**
 * @param {*} value
 * @return {value is WgslStruct<*>}
 */
function isStruct(value) {
  return value?.type === 'struct';
}

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
      } else if (isFunction(value)) {
        const identifier = ctx.uniqueName(value.label);

        for (const arg of value.args) {
          ctx.resolve(arg); // including the definitions of each arg type
        }
        ctx.resolve(value.returns); // including the definition of the return type
        const body = ctx.resolve(value.body);

        ctx.append(`fn ${identifier}${body}\n\n`);

        resolved = identifier;
      } else if (isStruct(value)) {
        const identifier = ctx.uniqueName(value.label);
        const members = Object.entries(value.props)
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
