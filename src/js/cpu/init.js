function initOpcodes (cpu, memory) {
  let adc = [[0x61, 2, 6, memory.indirectX],
             [0x65, 2, 3, memory.zeroPage],
             [0x69, 2, 2, memory.immediate],
             [0x6d, 3, 4, memory.absolute],
             [0x71, 2, 5, memory.indirectY],
             [0x75, 2, 4, memory.zeroPageX],
             [0x79, 3, 4, memory.absoluteY],
             [0x7d, 3, 4, memory.absoluteX]];
  initOp(cpu, adc, cpu.adc, "Add with Carry");

  let and = [[0x21, 2, 6, memory.indirectX],
             [0x25, 2, 3, memory.zeroPage],
             [0x29, 2, 2, memory.immediate],
             [0x2d, 3, 4, memory.absolute],
             [0x31, 2, 5, memory.indirectY],
             [0x35, 2, 4, memory.zeroPageX],
             [0x39, 3, 4, memory.absoluteY],
             [0x3d, 3, 4, memory.absoluteX]];
  initOp(cpu, and, cpu.and, "And with Accumulator");

  let asl = [[0x06, 2, 5, memory.zeroPage],
             [0x0a, 1, 2, memory.accumulator, true],
             [0x0e, 3, 6, memory.absolute],
             [0x16, 2, 6, memory.zeroPageX],
             [0x1e, 3, 7, memory.absoluteX]];
  initOp(cpu, asl, cpu.asl, "Arithmetic Shift Left");

  let bit = [[0x24, 2, 3, memory.zeroPage],
             [0x2c, 3, 4, memory.absolute]];
  initOp(cpu, bit, cpu.bit, "Test Bits with Accumulator");

  let cmp = [[0xc1, 2, 6, memory.indirectX],
             [0xc5, 2, 3, memory.zeroPage],
             [0xc9, 2, 2, memory.immediate],
             [0xcd, 3, 4, memory.absolute],
             [0xd1, 2, 5, memory.indirectY],
             [0xd5, 2, 4, memory.zeroPageX],
             [0xd9, 3, 4, memory.absoluteY],
             [0xdd, 3, 4, memory.absoluteX]];
  initOp(cpu, cmp, cpu.cmp, "Compare with Accumulator");

  let cpx = [[0xe0, 2, 2, memory.immediate],
             [0xe4, 2, 3, memory.zeroPage],
             [0xec, 3, 4, memory.absolute]];
  initOp(cpu, cpx, cpu.cpx, "Compare with X Register");

  let cpy = [[0xc0, 2, 2, memory.immediate],
             [0xc4, 2, 3, memory.zeroPage],
             [0xcc, 3, 4, memory.absolute]];
  initOp(cpu, cpy, cpu.cpy, "Compare with Y Register");

  let dec = [[0xc6, 2, 5, memory.zeroPage],
             [0xce, 3, 6, memory.absolute],
             [0xd6, 2, 6, memory.zeroPageX],
             [0xde, 3, 7, memory.absoluteX]];
  initOp(cpu, dec, cpu.dec, "Decrement Memory");

  let eor = [[0x41, 2, 6, memory.indirectX],
             [0x45, 2, 3, memory.zeroPage],
             [0x49, 2, 2, memory.immediate],
             [0x4d, 3, 4, memory.absolute],
             [0x51, 2, 5, memory.indirectY],
             [0x55, 2, 4, memory.zeroPageX],
             [0x59, 3, 4, memory.absoluteY],
             [0x5d, 3, 4, memory.absoluteX]];
  initOp(cpu, eor, cpu.eor, "Exclusive OR with Accumulator");

  let inc = [[0xe6, 2, 5, memory.zeroPage],
             [0xee, 3, 6, memory.absolute],
             [0xf6, 2, 6, memory.zeroPageX],
             [0xfe, 3, 7, memory.absoluteX]];
  initOp(cpu, inc, cpu.inc, "Increment Memory");

  let lda = [[0xa1, 2, 6, memory.indirectX],
             [0xa5, 2, 3, memory.zeroPage],
             [0xa9, 2, 2, memory.immediate],
             [0xad, 3, 4, memory.absolute],
             [0xb1, 2, 5, memory.indirectY],
             [0xb5, 2, 4, memory.zeroPageX],
             [0xb9, 3, 4, memory.absoluteY],
             [0xbd, 3, 4, memory.absoluteX]];
  initOp(cpu, lda, cpu.lda, "Load into Accumulator");

  let ldx = [[0xa2, 2, 2, memory.immediate],
             [0xa6, 2, 3, memory.zeroPage],
             [0xae, 3, 4, memory.absolute],
             [0xb6, 2, 4, memory.zeroPageY],
             [0xbe, 3, 4, memory.absoluteY]];
  initOp(cpu, ldx, cpu.ldx, "Load into X Register");

  let ldy = [[0xa0, 2, 2, memory.immediate],
             [0xa4, 2, 3, memory.zeroPage],
             [0xac, 3, 4, memory.absolute],
             [0xbc, 3, 4, memory.absoluteX],
             [0xb4, 2, 4, memory.zeroPageX]];
  initOp(cpu, ldy, cpu.ldy, "Load into Y Register");

  let lsr = [[0x46, 2, 5, memory.zeroPage],
             [0x4a, 1, 2, memory.accumulator, true],
             [0x4e, 3, 6, memory.absolute],
             [0x56, 2, 6, memory.zeroPageX],
             [0x5e, 3, 7, memory.absoluteX]];
  initOp(cpu, lsr, cpu.lsr, "Logical Shift Right");

  let ora = [[0x01, 2, 6, memory.indirectX],
             [0x05, 2, 3, memory.zeroPage],
             [0x09, 2, 2, memory.immediate],
             [0x0d, 3, 4, memory.absolute],
             [0x11, 2, 5, memory.indirectY],
             [0x15, 2, 4, memory.zeroPageX],
             [0x19, 3, 4, memory.absoluteY],
             [0x1d, 3, 4, memory.absoluteX]];
  initOp(cpu, ora, cpu.ora, "Inclusive OR with Accumulator");

  let rol = [[0x2a, 1, 2, memory.accumulator, true],
             [0x26, 2, 5, memory.zeroPage],
             [0x2e, 3, 6, memory.absolute],
             [0x36, 2, 6, memory.zeroPageX],
             [0x3e, 3, 7, memory.absoluteX]];
  initOp(cpu, rol, cpu.rol, "Rotate Left");

  let ror = [[0x66, 2, 5, memory.zeroPage],
             [0x6a, 1, 2, memory.accumulator, true],
             [0x6e, 3, 6, memory.absolute],
             [0x76, 2, 6, memory.zeroPageX],
             [0x7e, 3, 7, memory.absoluteX]];
  initOp(cpu, ror, cpu.ror, "Rotate Right");

  let sbc = [[0xe1, 2, 6, memory.indirectX],
             [0xe5, 2, 3, memory.zeroPage],
             [0xe9, 2, 2, memory.immediate],
             [0xed, 3, 4, memory.absolute],
             [0xf1, 2, 5, memory.indirectY],
             [0xf5, 2, 4, memory.zeroPageX],
             [0xf9, 3, 4, memory.absoluteY],
             [0xfd, 3, 4, memory.absoluteX]];
  initOp(cpu, sbc, cpu.sbc, "Subtract with Carry");

  let sta = [[0x81, 2, 6, memory.indirectX],
             [0x85, 2, 3, memory.zeroPage],
             [0x8d, 3, 4, memory.absolute],
             [0x91, 2, 6, memory.indirectY],
             [0x95, 2, 4, memory.zeroPageX],
             [0x99, 3, 5, memory.absoluteY],
             [0x9d, 3, 5, memory.absoluteX]];
  initOp(cpu, sta, cpu.sta, "Store Accumulator");

  let stx = [[0x86, 2, 3, memory.zeroPage],
             [0x8e, 3, 4, memory.absolute],
             [0x96, 2, 4, memory.zeroPageY]];
  initOp(cpu, stx, cpu.stx, "Store X Register");

  let sty = [[0x84, 2, 3, memory.zeroPage],
             [0x8c, 3, 4, memory.absolute],
             [0x96, 2, 4, memory.zeroPageX]];
  initOp(cpu, sty, cpu.sty, "Store Y Register");

  // Branch Instructions
  initOp(cpu, [[0x90, 2, 2, memory.relative]], cpu.bcc,
         "Branch on Carry Clear", false);
  initOp(cpu, [[0xb0, 2, 2, memory.relative]], cpu.bcs,
         "Branch on Carry Set", false);
  initOp(cpu, [[0xf0, 2, 2, memory.relative]], cpu.beq,
         "Branch on Equal", false);
  initOp(cpu, [[0x30, 2, 2, memory.relative]], cpu.bmi,
         "Branch on Result Minus", false);
  initOp(cpu, [[0xd0, 2, 2, memory.relative]], cpu.bne,
         "Branch on Not Equal", false);
  initOp(cpu, [[0x10, 2, 2, memory.relative]], cpu.bpl,
         "Branch on Result Plus", false);
  initOp(cpu, [[0x50, 2, 2, memory.relative]], cpu.bvc,
         "Branch on Overflow Clear", false);
  initOp(cpu, [[0x70, 2, 2, memory.relative]], cpu.bvs,
         "Branch on Overflow Set", false);

  // Jump Instructions
  let jmp = [[0x4c, 3, 3, memory.absolute, true],
             [0x6c, 3, 5, memory.indirect, true]];
  initOp(cpu, jmp, cpu.jmp, "Jump", false);

  initOp(cpu, [[0x20, 3, 6, memory.absolute, true]], cpu.jsr,
         "Jump To Subroutine", false);

  // Clear Flag Instructions
  initOp(cpu, [[0x18, 1, 2, null]], cpu.clc, "Clear Carry Flag");
  initOp(cpu, [[0xd8, 1, 2, null]], cpu.cld, "Clear Decimal Flag");
  initOp(cpu, [[0x58, 1, 2, null]], cpu.cli, "Clear Interrupt Flag");
  initOp(cpu, [[0xb8, 1, 2, null]], cpu.clv, "Clear Overflow Flag");

  // Set Flag Instructions
  initOp(cpu, [[0x38, 1, 2, null]], cpu.sec, "Set Carry Flag");
  initOp(cpu, [[0xf8, 1, 2, null]], cpu.sed, "Set Decimal Flag");
  initOp(cpu, [[0x78, 1, 2, null]], cpu.sei, "Set Interrupt Flag");

  // Stack Instructions
  initOp(cpu, [[0x48, 1, 3, null]], cpu.pha, "Push Accumulator to Stack");
  initOp(cpu, [[0x08, 1, 3, null]], cpu.php, "Push Status to Stack");
  initOp(cpu, [[0x68, 1, 4, null]], cpu.pla, "Pull Accumulator from Stack");
  initOp(cpu, [[0x28, 1, 4, null]], cpu.plp, "Pull Status from Stack");

  // Transfer Instructions
  initOp(cpu, [[0xaa, 1, 2, null]], cpu.tax, "Transfer Accumulator to X");
  initOp(cpu, [[0xa8, 1, 2, null]], cpu.tay, "Transfer Accumulator to Y");
  initOp(cpu, [[0xba, 1, 2, null]], cpu.tsx, "Transfer Stack Pointer to X");
  initOp(cpu, [[0x8a, 1, 2, null]], cpu.txa, "Transfer X to Accumulator");
  initOp(cpu, [[0x9a, 1, 2, null]], cpu.txs, "Transfer X to Stack Pointer");
  initOp(cpu, [[0x98, 1, 2, null]], cpu.tya, "Transfer Y to Accumulator");

  // Misc Implied Instructions
  initOp(cpu, [[0x00, 1, 7, null]], cpu.brk, "Force Break");
  initOp(cpu, [[0xca, 1, 2, null]], cpu.dex, "Decrement X");
  initOp(cpu, [[0x88, 1, 2, null]], cpu.dey, "Decrement Y");
  initOp(cpu, [[0xe8, 1, 2, null]], cpu.inx, "Increment X");
  initOp(cpu, [[0xc8, 1, 2, null]], cpu.iny, "Increment Y");
  initOp(cpu, [[0xea, 1, 2, null]], cpu.nop, "No Operation");
  initOp(cpu, [[0x40, 1, 6, null]], cpu.rti, "Return from Interrupt");
  initOp(cpu, [[0x60, 1, 6, null]], cpu.rts, "Return from Subroutine");
}

function loadWrapper (addrMode) {
  return function (cpu) {
    let address = addrMode.call(cpu.memory, cpu);
    return cpu.memory.load(address);
  };
}

function storeWrapper (addrMode) {
  return function (cpu, value) {
    let address = addrMode.call(cpu.memory, cpu);
    return cpu.memory.store(address, value);
  };
}

function initAccessor (addrMode, raw) {
  /*
   Raw ops == JSR/JMP and Accumulator calls.
   Deref == operate on the byte *at* the address.
   Getters always deref except for raw ops.
   Setters always deref except for Accumulator calls.
   */

  let accessor = {
    get: loadWrapper(addrMode),
    set: storeWrapper(addrMode)
  };

  // KLUDGE: The only raw setter calls are in accumulator mode.
  // Specifically in asl, lsr, rol, and ror.
  if (raw) {
   accessor = {
      get: (cpu) => addrMode.call(cpu.memory, cpu),
      set: (cpu, value) => { cpu.acc = value; }
    };
  }

  return accessor;
}

function buildOp (cpu, version, method, trackPC) {
  let [bytes, cycles, addrMode, raw] = version;
  let accessor = initAccessor(addrMode, raw);
  return function () {
    this.pc += 1;
    method.bind(this)(accessor);
    if (trackPC) {
      this.pc += bytes - 1;
    }
    return this.cc += cycles;
  }.bind(cpu);
}

function buildOpInfo (method, args, docs) {
  let [bytes, cycles, addrMode] = args;
  return {
    name: method.name.toUpperCase(),
    addrMode: addrMode ? addrMode.name : "implied",
    docs: docs,
    size: bytes,
    cycles: cycles
  };
}

function initOp (cpu, versions, method, docs, trackPC = true) {
  versions.forEach( version => {
    let [op, ...args] = version;
    cpu.opcodes[op] = buildOp(cpu, args, method, trackPC);
    cpu.opsInfo[op] = buildOpInfo(method, args, docs);
  });
}

export { initOpcodes };
