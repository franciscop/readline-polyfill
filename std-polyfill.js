import EventEmitter from "node:events";

class Readable extends EventEmitter {
  fromWeb(rs) {
    this.rs = rs;
    this.begin();
  }

  isRaw = true;

  async begin() {
    const reader = this.rs.getReader();

    let done = false;
    do {
      const res = await reader.read();
      done = res.done;
      const value = res.value;
      this.emit("data", value);
    } while (!done);

    this.emit("end");
  }
}

// Make the instance
const webRSToNodeRS = async (rs) => {
  const nodeStream = new Readable();
  nodeStream.fromWeb(rs);
  return nodeStream;
};

process.stdin = await webRSToNodeRS(Bun.stdin.stream());

class Writable {
  fromWeb(ws) {
    // console.log(ws);
    // this.writer = ws.getReader();
  }

  async write(data) {
    if (this.ongoing) {
      await thiss.ongoing;
    }
    delete this.ongoing;
  }

  end(data) {
    if (data) {
      this.writer.write(data);
    }
    this.writer.close();
  }
}

// Make the instance
const webWSToNodeWS = async (ws) => {
  const nodeStream = new Writable();
  nodeStream.fromWeb(ws);
  return nodeStream;
};

process.stdout = await webWSToNodeWS(Bun.stdout.stream());
