import $ from 'jquery';
import _ from 'lodash';

import { Cpu } from "./cpu/cpu";
import { Memory } from "./memory/memory";

import { AppController } from "./controllers/app";

const cpuState = $(".nes-state");
const cpuControls = $(".nes-controls");
const disassembly = $(".nes-disassembly");

let pageElements = {
  state: cpuState,
  controls: cpuControls,
  disassembly: disassembly
};
let cpu = new Cpu(new Memory);

let app = new AppController(cpu, pageElements);
app.init();
