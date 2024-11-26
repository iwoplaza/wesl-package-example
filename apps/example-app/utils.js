// Helpers that are able to use the types from WESL packages.

/**
 * @template T
 * @typedef {import('wesl-linker').ValueOf<T>} ValueOf
 */

/**
 * @template TData
 * @param {GPUBuffer} buffer
 * @param {TData} schema
 * @returns {{ write(value: ValueOf<TData>): void }}
 */
export function wrapBuffer(buffer, schema) {
  return {
    /**
     * @param {ValueOf<TData>} value
     */
    write(value) {
      // TODO: Perform data marshalling based on the schema. TypeGPU already does this.
    },
  };
}
