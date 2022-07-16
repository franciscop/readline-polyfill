# Readline Polyfill

Polyfill for `readline` in Node.js using only the basics of `stdin`, `stdout`, `tty` and `EventEmitter`. Some of the examples in Node.js website work. To test them, you can run the examples and interact with them:

```bash
// Works, meaning they have been polyfilled without using `readline`:
node example-1.js
node example-2.js
node example-3.js

// Does not work, since we also need to properly polyfill stdin and stdout:
bun example-1.bun.js

// TODO/future: Promises API for Readline:
node example-promises-1.js
```

## Contributing

We need to create `process.stdin` and `process.stdout` that work as the native ones based on `Bun.stdin` and `Bun.stdout`. For this, we are working on `std-polyfill.js`.

So right now if you want to help, we need to get `std-polyfill.js` working. Some tests or automated examples would be nice not to have to run both at the same time, but now with `bun example-1.bun.js` you can see issues in `std-polyfill.js`.

Question: do we make the minimum that works, or do we polyfill the whole `stdin` and `stdout`? (How much work is that??)

For now let's do the basic, we can always extend it later. Let's try to use things as documented on the Official Node.js documentation, e.g. create new class names, extending EventEmitter where appropriate, etc.

## Sources

- Many general snippets: https://www.jasnell.me/posts/webstreams
- NodeStream: https://nodejs.org/api/stream.html
- WebStream: https://nodejs.org/api/webstreams.html
