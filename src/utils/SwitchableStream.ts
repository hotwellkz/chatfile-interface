export class SwitchableStream {
  private controller: ReadableStreamDefaultController | null = null;
  private currentReader: ReadableStreamDefaultReader | null = null;
  public switches = 0;
  public readable: ReadableStream;

  constructor() {
    this.readable = new ReadableStream({
      start: (controller) => {
        this.controller = controller;
      },
    });
  }

  async switchSource(newStream: ReadableStream) {
    this.switches++;
    
    if (this.currentReader) {
      await this.currentReader.cancel();
    }

    const reader = newStream.getReader();
    this.currentReader = reader;

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        this.controller?.enqueue(value);
      }
    } catch (error) {
      console.error('Error in stream:', error);
      throw error;
    }
  }

  close() {
    if (this.currentReader) {
      this.currentReader.cancel();
    }
    this.controller?.close();
  }
}