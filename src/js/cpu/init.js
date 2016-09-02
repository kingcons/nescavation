function initOpcodes (cpu, memory) {
  let adc = [[0x61, 2, memory.indirectX],
             [0x65, 2, memory.zeroPage],
             [0x69, 2, memory.immediate],
             [0x6d, 3, memory.absolute],
             [0x71, 2, memory.indirectY],
             [0x75, 2, memory.zeroPageX],
             [0x79, 3, memory.absoluteY],
             [0x7d, 3, memory.absoluteX]];
  initOp(cpu, adc, cpu.adc);

  let and = [[0x21, 2, memory.indirectX],
             [0x25, 2, memory.zeroPage],
             [0x29, 2, memory.immediate],
             [0x2d, 3, memory.absolute],
             [0x31, 2, memory.indirectY],
             [0x35, 2, memory.zeroPageX],
             [0x39, 3, memory.absoluteY],
             [0x3d, 3, memory.absoluteX]];
  initOp(cpu, and, cpu.and);

  let asl = [[0x06, 2, memory.zeroPage],
             [0x0a, 1, memory.accumulator],
             [0x0e, 3, memory.absolute],
             [0x16, 2, memory.zeroPageX],
             [0x1e, 3, memory.absoluteX]];
  initOp(cpu, asl, cpu.asl);

  let bit = [[0x24, 2, memory.zeroPage],
             [0x2c, 3, memory.absolute]];
  initOp(cpu, bit, cpu.bit);

  let cmp = [[0xc1, 2, memory.indirectX],
             [0xc5, 2, memory.zeroPage],
             [0xc9, 2, memory.immediate],
             [0xcd, 3, memory.absolute],
             [0xd1, 2, memory.indirectY],
             [0xd5, 2, memory.zeroPageX],
             [0xd9, 3, memory.absoluteY],
             [0xdd, 3, memory.absoluteX]];
  initOp(cpu, cmp, cpu.cmp);

  let cpx = [[0xe0, 2, memory.immediate],
             [0xe4, 2, memory.zeroPage],
             [0xec, 3, memory.absolute]];
  initOp(cpu, cpx, cpu.cpx);

  let cpy = [[0xc0, 2, memory.immediate],
             [0xc4, 2, memory.zeroPage],
             [0xcc, 3, memory.absolute]];
  initOp(cpu, cpy, cpu.cpy);

  let dec = [[0xc6, 2, memory.zeroPage],
             [0xce, 3, memory.absolute],
             [0xd6, 2, memory.zeroPageX],
             [0xde, 3, memory.absoluteX]];
  initOp(cpu, dec, cpu.dec);

  let eor = [[0x41, 2, memory.indirectX],
             [0x45, 2, memory.zeroPage],
             [0x49, 2, memory.immediate],
             [0x4d, 3, memory.absolute],
             [0x51, 2, memory.indirectY],
             [0x55, 2, memory.zeroPageX],
             [0x59, 3, memory.absoluteY],
             [0x5d, 3, memory.absoluteX]];
  initOp(cpu, eor, cpu.eor);

  let inc = [[0xe6, 2, memory.zeroPage],
             [0xee, 3, memory.absolute],
             [0xf6, 2, memory.zeroPageX],
             [0xfe, 3, memory.absoluteX]];
  initOp(cpu, inc, cpu.inc);

  let lda = [[0xa1, 2, memory.indirectX],
             [0xa5, 2, memory.zeroPage],
             [0xa9, 2, memory.immediate],
             [0xad, 3, memory.absolute],
             [0xb1, 2, memory.indirectY],
             [0xb5, 2, memory.zeroPageX],
             [0xb9, 3, memory.absoluteY],
             [0xbd, 3, memory.absoluteX]];
  initOp(cpu, lda, cpu.lda);

  let ldx = [[0xa2, 2, memory.immediate],
             [0xa6, 2, memory.zeroPage],
             [0xae, 3, memory.absolute],
             [0xb6, 2, memory.zeroPageY],
             [0xbe, 3, memory.absoluteY]];
  initOp(cpu, ldx, cpu.ldx);

  let ldy = [[0xa0, 2, memory.immediate],
             [0xa4, 2, memory.zeroPage],
             [0xac, 3, memory.absolute],
             [0xbc, 3, memory.absoluteX],
             [0xb4, 2, memory.zeroPageX]];
  initOp(cpu, ldy, cpu.ldy);

  let lsr = [[0x46, 2, memory.zeroPage],
             [0x4a, 1, memory.accumulator],
             [0x4e, 3, memory.absolute],
             [0x56, 2, memory.zeroPageX],
             [0x5e, 3, memory.absoluteX]];
  initOp(cpu, lsr, cpu.lsr);

  let ora = [[0x01, 2, memory.indirectX],
             [0x05, 2, memory.zeroPage],
             [0x09, 2, memory.immediate],
             [0x0d, 3, memory.absolute],
             [0x11, 2, memory.indirectY],
             [0x15, 2, memory.zeroPageX],
             [0x19, 3, memory.absoluteY],
             [0x1d, 3, memory.absoluteX]];
  initOp(cpu, ora, cpu.ora);

  let rol = [[0x2a, 1, memory.accumulator],
             [0x26, 2, memory.zeroPage],
             [0x2e, 3, memory.absolute],
             [0x36, 2, memory.zeroPageX],
             [0x3e, 3, memory.absoluteX]];
  initOp(cpu, rol, cpu.rol);

  let ror = [[0x66, 2, memory.zeroPage],
             [0x6a, 1, memory.accumulator],
             [0x6e, 3, memory.absolute],
             [0x76, 2, memory.zeroPageX],
             [0x7e, 3, memory.absoluteX]];
  initOp(cpu, ror, cpu.ror);

  let sbc = [[0xe1, 2, memory.indirectX],
             [0xe5, 2, memory.zeroPage],
             [0xe9, 2, memory.immediate],
             [0xed, 3, memory.absolute],
             [0xf1, 2, memory.indirectY],
             [0xf5, 2, memory.zeroPageX],
             [0xf9, 3, memory.absoluteY],
             [0xfd, 3, memory.absoluteX]];
  initOp(cpu, sbc, cpu.sbc);

  let sta = [[0x81, 2, memory.indirectX],
             [0x85, 2, memory.zeroPage],
             [0x8d, 3, memory.absolute],
             [0x91, 2, memory.indirectY],
             [0x95, 2, memory.zeroPageX],
             [0x99, 3, memory.absoluteY],
             [0x9d, 3, memory.absoluteX]];
  initOp(cpu, sta, cpu.sta);

  let stx = [[0x86, 2, memory.zeroPage],
             [0x8e, 3, memory.absolute],
             [0x96, 2, memory.zeroPageY]];
  initOp(cpu, stx, cpu.stx);

  let sty = [[0x84, 2, memory.zeroPage],
             [0x8c, 3, memory.absolute],
             [0x96, 2, memory.zeroPageX]];
  initOp(cpu, sty, cpu.sty);

  // Branch Instructions
  initOp(cpu, [[0x90, 2, memory.relative]], cpu.bcc, false);
  initOp(cpu, [[0xb0, 2, memory.relative]], cpu.bcs, false);
  initOp(cpu, [[0xf0, 2, memory.relative]], cpu.beq, false);
  initOp(cpu, [[0x30, 2, memory.relative]], cpu.bmi, false);
  initOp(cpu, [[0xd0, 2, memory.relative]], cpu.bne, false);
  initOp(cpu, [[0x10, 2, memory.relative]], cpu.bpl, false);
  initOp(cpu, [[0x50, 2, memory.relative]], cpu.bvc, false);
  initOp(cpu, [[0x70, 2, memory.relative]], cpu.bvs, false);

  // Jump Instructions
  let jmp = [[0x4c, 3, memory.absolute],
             [0x6c, 3, memory.indirect]];
  initOp(cpu, jmp, cpu.jmp, false);

  initOp(cpu, [[0x20, 3, memory.absolute]], cpu.jsr, false);

  // Clear Flag Instructions
  initOp(cpu, [[0x18, 1, null]], cpu.clc);
  initOp(cpu, [[0xd8, 1, null]], cpu.cld);
  initOp(cpu, [[0x58, 1, null]], cpu.cli);
  initOp(cpu, [[0xb8, 1, null]], cpu.clv);

  // Set Flag Instructions
  initOp(cpu, [[0x38, 1, null]], cpu.sec);
  initOp(cpu, [[0xf8, 1, null]], cpu.sed);
  initOp(cpu, [[0x78, 1, null]], cpu.sei);

  // Stack Instructions
  initOp(cpu, [[0x48, 1, null]], cpu.pha);
  initOp(cpu, [[0x08, 1, null]], cpu.php);
  initOp(cpu, [[0x68, 1, null]], cpu.pla);
  initOp(cpu, [[0x28, 1, null]], cpu.plp);

  // Transfer Instructions
  initOp(cpu, [[0xaa, 1, null]], cpu.tax);
  initOp(cpu, [[0xa8, 1, null]], cpu.tay);
  initOp(cpu, [[0xba, 1, null]], cpu.tsx);
  initOp(cpu, [[0x8a, 1, null]], cpu.txa);
  initOp(cpu, [[0x9a, 1, null]], cpu.txs);
  initOp(cpu, [[0x98, 1, null]], cpu.tya);

  // Misc Implied Instructions
  initOp(cpu, [[0x00, 1, null]], cpu.brk);
  initOp(cpu, [[0xca, 1, null]], cpu.dex);
  initOp(cpu, [[0x88, 1, null]], cpu.dey);
  initOp(cpu, [[0xe8, 1, null]], cpu.inx);
  initOp(cpu, [[0xc8, 1, null]], cpu.iny);
  initOp(cpu, [[0xea, 1, null]], cpu.nop);
  initOp(cpu, [[0x40, 1, null]], cpu.rti);
  initOp(cpu, [[0x60, 1, null]], cpu.rts);
}

function initOp (cpu, versions, method, trackPC = true) {
  versions.forEach( version => {
    let [op, bytes, addrMode] = version;
    cpu.opcodes[op] = function () {
      cpu.pc += 1;
      method(addrMode);
      if (trackPC) {
        cpu.pc += bytes - 1;
      }
    };
  });
}

export { initOpcodes };
