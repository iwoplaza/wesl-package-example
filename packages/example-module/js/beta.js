// AUTO-GENERATED BY WESL. Original filename: ./beta.wesl
// @ts-check

import { fn } from 'wgsl-as-js';
import alpha__META, { double, Gradient } from './alpha.js';

const META = {
  filename: 'beta.wesl',
  text: `\
// The source of truth used to generate host-specific packaged formats (/js, /rust, ...).

import { double, Gradient } from './alpha.wesl';

export fn create_red_to_blue_gradient() -> Gradient {
  var result: Gradient;
  result.from = vec3f(1., 0., 0.);
  result.to = vec3f(0., 0., double(0.5));
  return result;
}
`,
  references: [alpha__META],
};

export default META;

// ---
// Definitions
// ---

export const create_red_to_blue_gradient = fn({
  src: { doc: META, start: 141, end: 314 },
  label: 'create_red_to_blue_gradient',
  argTypes: [],
  returnType: Gradient,
  body: [
    '() -> ',
    Gradient,
    ` {
  var result: `,
    Gradient,
    `;
  result.from = vec3f(1., 0., 0.);
  result.to = vec3f(0., 0., `,
    double,
    `(0.5));
  return result;
}`,
  ],
});
