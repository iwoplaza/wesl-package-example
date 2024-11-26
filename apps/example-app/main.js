// @ts-check

import { link } from 'wesl-linker';
import { create_red_to_blue_gradient } from 'example-module/beta';
import { Gradient } from 'example-module/alpha';
import { wrapBuffer } from './utils.js';

const code = link({ input: [create_red_to_blue_gradient] });

// Providing only the `create_red_to_blue_gradient includes all of its
// direct and transitive dependencies in the resulting code string.

//  [lee] nice feature, the DX is good for several reasons:
// . specifying the 'root module' (here 'import') via TypeScript imports is a nice DX
//   . I suppose the root module will typically be part of the app, though certainly could be in a library as here
//     But I think the the same approach might work too: import { app_main } from './shaders/app.wesl'?
// . automatically adding dependencies is really necessary for the DX.
//   I suppose we could live without it for a first version with a promise to fix it later if we had to.
//   But once you have more than one or two libraries, manually listing them (especially transitive ones)
//   will become really annoying.

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
  // 
  // [lee] This is really exciting. Super powerful. We've thought about this direction
  // but its way more amazing to see that you've got it working right now! 
  // I really want to see types available from WESL, so that libraries
  // like this are possible.
  //
  typedBuffer.write({ hello: 123 });
}
