class AppController {

  constructor (cpu, {state, controls, disassembly}) {
    this.cpu = cpu;
    this.reader = new FileReader();
    this.state = state;
    this.controls = controls;
    this.disassembly = disassembly;
  }

  init () {
    this.romLoadHandler();
  }

  swapCartridge () {
    let data = new Uint8Array(this.reader.result);
    this.cpu.memory.swapCart(data);
    this.cpu.reset();
    console.log(this.cpu);
  }

  romLoadHandler () {
    this.reader.onload = this.swapCartridge.bind(this);
    this.controls.find(".file").on("change", ev => {
      let file = ev.target.files[0];
      this.reader.readAsArrayBuffer(file);
    });
  }

};

export { AppController };
