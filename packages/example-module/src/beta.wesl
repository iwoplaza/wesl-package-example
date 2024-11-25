// The source of truth used to generate host-specific packaged formats (/js, /rust, ...).

import { double, Gradient } from './alpha.wesl';

export fn create_red_to_blue_gradient() -> Gradient {
  var result: Gradient;
  result.from = vec3f(1., 0., 0.);
  result.to = vec3f(0., 0., double(0.5));
  return result;
}