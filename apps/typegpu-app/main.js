// @ts-check

import tgpu from 'typegpu';
import * as d from 'typegpu/data';
import { Gradient } from 'example-module/alpha';

const root = await tgpu.init();

// Properly typed using a schema define outside of TypeGPU 🎉
const buffer = root.createBuffer(Gradient, {
  from: d.vec3f(0, 1, 2),
  to: d.vec3f(3, 4, 5),
});
