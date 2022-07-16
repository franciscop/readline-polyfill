import "./std-polyfill.js";
import EventEmitter from "node:events";

const CODE_EXIT = 3;
const CODE_BREAK = 13;
const CODE_DELETE = 127;
const isCode = (a, CODE) => Buffer.compare(a, Buffer.alloc(1, CODE)) === 0;

class InterfaceConstructor extends EventEmitter {
  constructor({ input, output, prompt }) {
    super();
    this.line = "";
    this.input = input;
    // Allow to read stroke by stroke to avoid ^C
    if (this.input.isTTY && this.input.setRawMode) {
      this.input.setRawMode(true);
    }
    this.output = output;
    this.message = prompt;

    this.input.on("data", async (chunk) => {
      this.line += "" + chunk;

      // Byte by byte, it's in RAW mode
      if (this.input.isRaw) {
        // When pressing delete, clear the line, remove 2 chars and recreate it from scratch
        if (isCode(chunk, CODE_DELETE)) {
          this.output.write("\r");
          this.output.clearLine();
          this.line = this.line.slice(0, -2);
          return this.output.write(this.message + this.line);
        }
        if (isCode(chunk, CODE_EXIT)) {
          return this.emit("close");
        }
        if (isCode(chunk, CODE_BREAK)) {
          console.log();
          const line = this.line;
          this.line = "";
          return this.emit("line", line);
        }
        if (this.output) {
          this.output.write("" + chunk);
        }
      } else {
        // Block by block
        while (this.line.includes("\n")) {
          const [line, ...rest] = ("" + this.line).split("\n");
          this.emit("line", line);
          this.line = rest.join("\n");
        }
      }
    });

    this.input.on("end", () => {
      if (this.line) {
        this.emit("line", this.line);
      }
    });
  }

  prompt() {
    this.output.write(this.message);
  }

  async *[Symbol.asyncIterator]() {
    let previous = "";
    for await (const chunk of this.input) {
      previous += chunk;
      let eolIndex;
      while (previous.includes("\n")) {
        const [line, ...rest] = previous.split("\n");
        yield line;
        this.emit("line", line);
        previous = rest.join("\n");
      }
    }
    if (previous.length > 0) {
      yield previous;
    }
  }
}

const createInterface = (options) => new InterfaceConstructor(options);

const clearLine = (stream, dir, callback) => {
  if (!stream.isTTY) return;
  // https://nodejs.org/api/tty.html#writestreamclearlinedir-callback
  stream.clearLine(dir, callback);
};

const clearScreenDown = (stream, callback) => {
  if (!stream.isTTY) return;
  // https://nodejs.org/api/tty.html#writestreamclearscreendowncallback
  stream.clearScreenDown(callback);
};

const cursorTo = (stream, x, y = 0, callback) => {
  if (!stream.isTTY) return;
  // https://nodejs.org/api/tty.html#writestreamcursortox-y-callback
  stream.cursorTo(x, y, callback);
};

const moveCursor = (stream, dx, dy, callback) => {
  if (!stream.isTTY) return;
  // https://nodejs.org/api/tty.html#writestreammovecursordx-dy-callback
  stream.moveCursor(dx, dy, callback);
};

export { createInterface, clearLine, clearScreenDown, cursorTo, moveCursor };
export default {
  createInterface,
  clearLine,
  clearScreenDown,
  cursorTo,
  moveCursor,
};
