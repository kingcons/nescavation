import { disassembleRange } from "../utils/disassembler";

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
    this.disasmHandler();
  }

  swapCartridge () {
    let data = new Uint8Array(this.reader.result);
    this.cpu.memory.swapCart(data);
    this.cpu.reset();
    console.log(this.cpu);
  }

  updateDisassembly () {
    let results = disassembleRange(this.cpu, 0x20);
    let format  = ([a, h, c]) => `<p>${a} | ${h} | ${c}</p>`;
    let html = `<div>
      <p>Address  |  Hexdump  |  Code</p>
      ${results.map(format).join("")}
      </div>
    `;
    this.disassembly.html(html);
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
      this.updateDisassembly();
    });
  }

  disasmHandler () {
    this.controls.find(".disassemble").on("click", event => {
      this.updateDisassembly();
    });
  }

};

export { AppController };
