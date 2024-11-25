// The source of truth used to generate host-specific packaged formats (/js, /rust, ...).

export fn half(value: f32) -> f32 {
  return value * 0.5;
}

export fn double(value: f32) -> f32 {
  return value * 2.;
}

export fn add(a: f32, b: f32) -> f32 {
  return a + b;
}

export struct Gradient {
  from: vec3f,
  to: vec3f,
}
