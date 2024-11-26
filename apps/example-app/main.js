// @ts-check

import { link } from 'wesl-linker';
import { create_red_to_blue_gradient } from 'example-module/beta';

const code = link({ input: [create_red_to_blue_gradient] });

console.log(code);
