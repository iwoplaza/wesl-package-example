// @ts-check

import { link } from 'wesl-linker';
import { create_red_to_blue_gradient } from 'example-module/beta';
import { Gradient } from 'example-module/alpha';
import { wrapBuffer } from './utils.js';

const code = link({ input: [create_red_to_blue_gradient] });

// Providing only the `create_red_to_blue_gradient includes all of its
// direct and transitive dependencies in the resulting code string.
// (run `pnpm start` from the root directory to see the result)
console.log(code);

/**
 * @returns {Promise<GPUDevice>}
 */
async function getDevice() {
  // Lets assume we have a GPU device.
  return /** @type {*} */ (Promise.resolve(undefined));
}

async function mockMain() {
  const device = await getDevice();

  const buffer = device.createBuffer({
    size: 16,
    usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.UNIFORM,
  });

  // We can write helpers that use the package's types to meaningfully
  // enrich the DX.
  const typedBuffer = wrapBuffer(buffer, Gradient);

  // Note how the TypeScript language server is mad that we did not provide a
  // valid value to write to the buffer. Hover over `write` to see what the
  // function actually expects.
  typedBuffer.write({ hello: 123 });
}
