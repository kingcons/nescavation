class Cpu {

  constructor (memory) {
    this.acc    = 0; // Accumulator
    this.xReg   = 0; // X Register
    this.yReg   = 0; // Y Register
    this.status = 0; // Status Register
    this.pc     = 0; // Program Counter
    this.sp     = 0; // Stack Pointer
    this.memory = memory;
  }

}

export { Cpu };
