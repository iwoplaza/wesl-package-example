# WESL Package Example

This repository showcases how WESL could be packaged for use by other WESL-based libraries or apps.

## Prerequisites
- Install pnpm v8.15.8

## Local setup

After cloning this repository locally, run the following in the repo's root directory:
```bash
pnpm install
```

After that, you can run the following any time you want to execute the "example app":
```bash
pnpm example-app
```

## Submodules

### packages/example-module

This package contains example .wesl source code (in `/src` folder), along with what a generated wgsl-as-js (pre-parsed WESL) format could look like (in `/js` folder). The
generation would happen as a pre-publishing step, on the side of the library author, and the source & resulting files would be uploaded to NPM.

The dependency on the `wgsl-as-js` package allows libraries to receive fixes even after they are published. For example:
- `wgsl-as-js@0.1.0` is published to NPM.
- `utility-lib@0.1.0` is published to NPM, with a dependency on `wgsl-as-js: ^0.1.0`.
- `wgsl-as-js@0.1.1` is published to NPM with a fix.
- New downloads of `utility-lib` will automatically receive the fix.

The types are tied directly to the resources they are meant to describe, which removes the need to later couple them back together by string key or by any other means
on the side of the library consumer (e.g., structs are defined as JS values, easy to analyze statically by TS and at runtime by JS).

Any references to other WGSL resources are done explicitly, by including them as values in between raw WGSL code strings. This makes the collection of transitive dependencies trivial.

### packages/wesl-linker

A POC of a linker that takes advantage of the wgsl-for-js format to generate spec-compliant WGSL for use in shader modules. It resolves code for each resource only once, automatically preventing any duplicate definitions. It also gives resources identifiers in a way that prevents any name clashes.

### apps/example-app

A simple Node.js app that shows how the linker can be used, and how to create utilities that leverage the inherent type information stored in the package.

### apps/typegpu-app

Sample code showcasing that exotic data types (those originating outside of TypeGPU) can be used by TypeGPU APIs, and properly infer type information from them.

## Addressing possible limitations

In case of an error or limitation that cannot be fixed by updating `wgsl-as-js`, an additional package can be installed that performs the parsing and creates `wgsl-as-js` values at runtime.

Example of linking a valid/up-to-date library:

```ts
import { link } from 'wesl-linker';
import { entryPoint } from 'example-module';

const rawWGSL = link({ input: entryPoint });
```

Example of falling back to JIT parsing in case something is wrong with the packaged library.

```ts
import { link } from 'wesl-linker';
import { WESLJitParser } from 'wesl-jit';
// Importing the metadata, instead of reified references...
// Still retains references to other WESL files,
// so is able to handle transitive dependencies.
import moduleMeta from 'example-module';

const rawWGSL = link({ input: moduleMeta, jit: new WESLJitParser() });
```
