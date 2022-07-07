# Readline Polyfill

Polyfill for `readline` in Node.js using only the basics of `stdin`, `stdout`, `tty` and `EventEmitter`. Some of the examples in Node.js website work. To test them, you can run the examples and interact with them:

```bash
// Works:
node example-1.js
node example-2.js
node example-3.js

// Not yet:
node example-promises-1.js
```

In some cases, the interface of readline is just a wrapper around TTY behavior.