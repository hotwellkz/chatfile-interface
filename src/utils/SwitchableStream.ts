class SwitchableStream {
  private currentController: ReadableStreamDefaultController | null = null;
  private _switches = 0;
  public readable: ReadableStream;

  constructor() {
    this.readable = new ReadableStream({
      start: (controller) => {
        this.currentController = controller;
      }
    });
  }

  get switches() {
    return this._switches;
  }

  async switchSource(newSource: ReadableStream) {
    this._switches++;
    const reader = newSource.getReader();

    try {
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          break;
        }

        if (this.currentController) {
          this.currentController.enqueue(value);
        }
      }
    } catch (error) {
      console.error('Error in switchSource:', error);
      throw error;
    }
  }

  close() {
    if (this.currentController) {
      this.currentController.close();
    }
  }
}

module.exports = SwitchableStream;