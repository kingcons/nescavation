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
    this.playPauseHandler();
    this.stepHandler();
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

  playPauseHandler () {
    // this.controls.find(".play").on("click", event => {
    //   let text = event.target.innerHTML;
    //   if (text === "Play") {
    //     event.target.innerHTML = "Pause";
    //   } else {
    //     event.target.innerHTML = "Play";
    //   }
    //   this.cpu.paused = !this.cpu.paused;
    //   this.cpu.run();
    // });
  }

  stepHandler () {
    this.controls.find(".step").on("click", event => {
      this.cpu.step();
    });
  }

};

export { AppController };
