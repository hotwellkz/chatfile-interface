export default class SwitchableStream {
  private controller: ReadableStreamDefaultController | null = null;
  private encoder = new TextEncoder();
  public switches = 0;
  public readable: ReadableStream;

  constructor() {
    this.readable = new ReadableStream({
      start: (controller) => {
        this.controller = controller;
      },
    });
  }

  async switchSource(stream: ReadableStream) {
    this.switches++;
    const reader = stream.getReader();

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        if (this.controller) {
          this.controller.enqueue(this.encoder.encode(value));
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  close() {
    if (this.controller) {
      this.controller.close();
    }
  }
}
