export class SwitchableStream {
  switches: number;
  controller: TransformStream;
  readable: ReadableStream;
  writer: WritableStreamDefaultWriter;

  constructor() {
    this.switches = 0;
    this.controller = new TransformStream();
    this.readable = this.controller.readable;
    this.writer = this.controller.writable.getWriter();
  }

  async switchSource(newSource: ReadableStream) {
    this.switches++;
    const reader = newSource.getReader();
    
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        await this.writer.write(value);
      }
    } catch (error) {
      console.error('Error in stream switch:', error);
      throw error;
    }
  }

  async close() {
    try {
      await this.writer.close();
    } catch (error) {
      console.error('Error closing stream:', error);
    }
  }
}