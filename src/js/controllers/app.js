import { disassembleRange } from "../utils/disassembler";
import { disasmTmpl } from "../templates/disasm.tmpl";
import { cpuRegTmpl } from "../templates/cpu-regs.tmpl";

const CPU_CYCLES_PER_MS = 1789.772;
const CPU_CYCLES_PER_FRAME = 29780;

// References:
// [1] https://developer.mozilla.org/en-US/docs/Games/Anatomy
// [2] http://wiki.nesdev.com/w/index.php/Clock_rate

class AppController {

  constructor (cpu, {state, controls, disassembly, screen}) {
    this.reader       = new FileReader();
    this.state        = state;
    this.controls     = controls;
    this.disassembly  = disassembly;
    this.screen       = screen;
    this.cpu          = cpu;
    this.paused       = true;
    this.lastFrameAt  = null;
  }

  init () {
    this.initScreen();
    this.updateInfo();
    this.romLoadHandler();
    this.playPauseHandler();
    this.stepHandler();
    this.stepFrameHandler();
  }

  initScreen () {
    let context = this.screen.getContext('2d');
    context.fillStyle = 'black';
    context.fillRect(0, 0, 256, 240);
  }

  swapCartridge () {
    let data = new Uint8Array(this.reader.result);
    this.cpu.memory.swapCart(data);
    this.cpu.reset();
    this.updateInfo();
  }

  romLoadHandler () {
    this.reader.onload = this.swapCartridge.bind(this);
    this.controls.find(".file").on("change", ev => {
      let file = ev.target.files[0];
      this.reader.readAsArrayBuffer(file);
    });
  }

  updateInfo () {
    this.updateDisassembly();
    this.updateCpuState();
  }

  updateDisassembly () {
    let results = disassembleRange(this.cpu, 0x18);
    let html = disasmTmpl(results);
    this.disassembly.html(html);
  }

  updateCpuState () {
    let html = cpuRegTmpl(this.cpu);
    this.controls.find(".cpu-state").html(html);
  }

  stepHandler () {
    this.controls.find(".step").on("click", event => {
      this.cpu.step();
      this.updateInfo();
    });
  }

  stepFrameHandler () {
    this.controls.find(".step-frame").on("click", event => {
      this.stepNintendo(this.cpu.cc, CPU_CYCLES_PER_FRAME);
      this.updateInfo();
    });
  }

  playPauseHandler () {
    this.controls.find(".play").on("click", event => {
      this.paused = !this.paused;

      let text = event.target.innerHTML;
      if (text === "Play") {
        let runCallback = this.run.bind(this);
        this.frameId = window.requestAnimationFrame(runCallback);
        event.target.innerHTML = "Pause";
      } else {
        event.target.innerHTML = "Play";
        this.lastFrameAt = null;
        this.updateInfo();
      }
    });
  }

  getWorkAmount (currentTime) {
    if (this.lastFrameAt) {
      // Figure out how much time has passed. Catch up the NES!
      let elapsed = currentTime - this.lastFrameAt;
      return Math.floor(elapsed * CPU_CYCLES_PER_MS);
    } else {
      // We just started. Render a frame.
      return CPU_CYCLES_PER_FRAME;
    }
  }

  stepNintendo (prevCycles, todoCycles) {
    while (this.cpu.cc - prevCycles < todoCycles) {
      let ppuResult = this.cpu.memory.ppu.ppuResult;

      let cycles = this.cpu.step();
      for (let i = 0; i < cycles * 3; i++) {
        ppuResult = this.cpu.memory.ppu.step();
      }

      if (ppuResult.dma) { this.cpu.cc += 513; }
      if (ppuResult.vBlank) { this.cpu.nmi(); }
      if (ppuResult.newFrame) { this.updateScreen(this.cpu); }
    }

    let overtime = this.cpu.cc - (prevCycles + todoCycles);
    // console.log(`Worked overtime: ${overtime} cycles`);
    // this.cpu.cc = overtime;
  }

  updateScreen (cpu) {
    let ppu = this.cpu.memory.ppu;
  }

  run (currentTime) {
    if (!this.paused) {
      let runCallback = this.run.bind(this);
      this.frameId = window.requestAnimationFrame(runCallback);
    }

    let cycles = this.cpu.cc;
    let catchup = this.getWorkAmount(currentTime);
    this.stepNintendo(cycles, catchup);

    this.lastFrameAt = currentTime;
    let stepDuration = window.performance.now() - currentTime;
    console.log(`Step took ${stepDuration} milliseconds`);
  }

};

export { AppController };
