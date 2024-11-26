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
pnpm start
```

## Submodules

### packages/example-module

This package contains example .wesl source code (in `/src` folder), along with what a generated wgsl-for-js (pre-parsed WESL) format could look like (in `/js` folder). The
generation would happen as a pre-publishing step, on the side of the library author, and the source & resulting files would be uploaded to NPM.

The wgsl-for-js code is accompanied by JSDoc type information, a decision made to keep
 this example simple and reduce any build-step necessary to consume this package. The 
 type information could just as well be stored in a separate `.d.ts` file alongside the `.js` file.

 The types are tied directly to the resources they are meant to describe, which removes the need to later couple them back together by string key or by any other means on the side of the library consumer (e.g., structs are defined as JS values, easy to analyze statically by TS and at runtime by JS).

 Any references to other WGSL resources are done explicitly, by including them as values in between raw WGSL code strings. This makes the collection of transitive dependencies trivial.

 ### packages/wesl-linker

 A POC of a linker that takes advantage of the wgsl-for-js format to generate spec-compliant WGSL for use in shader modules. It resolves code for each resource only once, automatically preventing any duplicate definitions. It also gives resources identifiers in a way that prevents any name clashes.

 ### apps/example-app

 A simple Node.js app that shows how the linker can be used, and how to create utilities that leverage the inherent type information stored in the package.