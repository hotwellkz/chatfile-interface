class SwitchableStream {
  constructor() {
    this.currentController = null;
    this._switches = 0;
    this.readable = new ReadableStream({
      start: (controller) => {
        this.currentController = controller;
      }
    });
  }

  get switches() {
    return this._switches;
  }

  async switchSource(newSource) {
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
