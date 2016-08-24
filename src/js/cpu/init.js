function init (cpu, memory) {
  let adc = [[0x61, memory.indirect_x],
             [0x65, memory.zero_page],
             [0x69, memory.immediate],
             [0x6d, memory.absolute],
             [0x71, memory.indirect_y],
             [0x75, memory.zero_page_x],
             [0x79, memory.absolute_y],
             [0x7d, memory.absolute_x]];
  init_op(cpu, adc, cpu.adc);

  let and = [[0x21, memory.indirect_x],
             [0x25, memory.zero_page],
             [0x29, memory.immediate],
             [0x2d, memory.absolute],
             [0x31, memory.indirect_y],
             [0x35, memory.zero_page_x],
             [0x39, memory.absolute_y],
             [0x3d, memory.absolute_x]];
  init_op(cpu, and, cpu.and);

  let asl = [[0x06, memory.zero_page],
             [0x0a, memory.accumulator],
             [0x0e, memory.absolute],
             [0x16, memory.zero_page_x],
             [0x1e, memory.absolute_x]];
  init_op(cpu, asl, cpu.asl);

  let bit = [[0x24, memory.zero_page],
             [0x2c, memory.absolute]];
  init_op(cpu, bit, cpu.bit);

  init_op(cpu, [[0x00, null]], cpu.brk);

  let cmp = [[0xc1, memory.indirect_x],
             [0xc5, memory.zero_page],
             [0xc9, memory.immediate],
             [0xcd, memory.absolute],
             [0xd1, memory.indirect_y],
             [0xd5, memory.zero_page_x],
             [0xd9, memory.absolute_y],
             [0xdd, memory.absolute_x]];
  init_op(cpu, cmp, cpu.cmp);

  let cpx = [[0xe0, memory.immediate],
             [0xe4, memory.zero_page],
             [0xec, memory.absolute]];
  init_op(cpu, cpx, cpu.cpx);

  let cpy = [[0xc0, memory.immediate],
             [0xc4, memory.zero_page],
             [0xcc, memory.absolute]];
  init_op(cpu, cpy, cpu.cpy);

  let dec = [[0xc6, memory.zero_page],
             [0xce, memory.absolute],
             [0xd6, memory.zero_page_x],
             [0xde, memory.absolute_x]];
  init_op(cpu, dec, cpu.dec);

  init_op(cpu, [[0xca, null]], cpu.dex);
  init_op(cpu, [[0x88, null]], cpu.dey);

  let eor = [[0x41, memory.indirect_x],
             [0x45, memory.zero_page],
             [0x49, memory.immediate],
             [0x4d, memory.absolute],
             [0x51, memory.indirect_y],
             [0x55, memory.zero_page_x],
             [0x59, memory.absolute_y],
             [0x5d, memory.absolute_x]];
  init_op(cpu, eor, cpu.eor);

  let inc = [[0xe6, memory.zero_page],
             [0xee, memory.absolute],
             [0xf6, memory.zero_page_x],
             [0xfe, memory.absolute_x]];
  init_op(cpu, inc, cpu.inc);

  init_op(cpu, [[0xe8, null]], cpu.inx);
  init_op(cpu, [[0xc8, null]], cpu.iny);

  let jmp = [[0x4c, memory.absolute],
             [0x6c, memory.indirect]];
  init_op(cpu, jmp, cpu.jmp);

  init_op(cpu, [[0x20, memory.absolute]], cpu.jsr);

  let lda = [[0xa1, memory.indirect_x],
             [0xa5, memory.zero_page],
             [0xa9, memory.immediate],
             [0xad, memory.absolute],
             [0xb1, memory.indirect_y],
             [0xb5, memory.zero_page_x],
             [0xb9, memory.absolute_y],
             [0xbd, memory.absolute_x]];
  init_op(cpu, lda, cpu.lda);

  let ldx = [[0xa2, memory.immediate],
             [0xa6, memory.zero_page],
             [0xae, memory.absolute],
             [0xb6, memory.zero_page_y],
             [0xbe, memory.absolute_y]];
  init_op(cpu, ldx, cpu.ldx);

  let ldy = [[0xa0, memory.immediate],
             [0xa4, memory.zero_page],
             [0xac, memory.absolute],
             [0xbc, memory.absolute_x],
             [0xb4, memory.zero_page_x]];
  init_op(cpu, ldy, cpu.ldy);

  let lsr = [[0x46, memory.zero_page],
             [0x4a, memory.accumulator],
             [0x4e, memory.absolute],
             [0x56, memory.zero_page_x],
             [0x5e, memory.absolute_x]];
  init_op(cpu, lsr, cpu.lsr);

  init_op(cpu, [[0xea, null]], cpu.nop);

  let ora = [[0x01, memory.indirect_x],
             [0x05, memory.zero_page],
             [0x09, memory.immediate],
             [0x0d, memory.absolute],
             [0x11, memory.indirect_y],
             [0x15, memory.zero_page_x],
             [0x19, memory.absolute_y],
             [0x1d, memory.absolute_x]];
  init_op(cpu, ora, cpu.ora);

  let rol = [[0x2a, memory.accumulator],
             [0x26, memory.zero_page],
             [0x2e, memory.absolute],
             [0x36, memory.zero_page_x],
             [0x3e, memory.absolute_x]];
  init_op(cpu, rol, cpu.rol);

  let ror = [[0x66, memory.zero_page],
             [0x6a, memory.accumulator],
             [0x6e, memory.absolute],
             [0x76, memory.zero_page_x],
             [0x7e, memory.absolute_x]];
  init_op(cpu, ror, cpu.ror);

  init_op(cpu, [[0x40, null]], cpu.rti);
  init_op(cpu, [[0x60, null]], cpu.rts);

  let sbc = [[0xe1, memory.indirect_x],
             [0xe5, memory.zero_page],
             [0xe9, memory.immediate],
             [0xed, memory.absolute],
             [0xf1, memory.indirect_y],
             [0xf5, memory.zero_page_x],
             [0xf9, memory.absolute_y],
             [0xfd, memory.absolute_x]];
  init_op(cpu, sbc, cpu.sbc);

  let sta = [[0x81, memory.indirect_x],
             [0x85, memory.zero_page],
             [0x8d, memory.absolute],
             [0x91, memory.indirect_y],
             [0x95, memory.zero_page_x],
             [0x99, memory.absolute_y],
             [0x9d, memory.absolute_x]];
  init_op(cpu, sta, cpu.sta);

  let stx = [[0x86, memory.zero_page],
             [0x8e, memory.absolute],
             [0x96, memory.zero_page_y]];
  init_op(cpu, stx, cpu.stx);

  let sty = [[0x84, memory.zero_page],
             [0x8c, memory.absolute],
             [0x96, memory.zero_page_x]];
  init_op(cpu, sty, cpu.sty);

  // Branch Instructions
  init_op(cpu, [[0x90, memory.relative]], cpu.bcc);
  init_op(cpu, [[0xb0, memory.relative]], cpu.bcs);
  init_op(cpu, [[0xf0, memory.relative]], cpu.beq);
  init_op(cpu, [[0x30, memory.relative]], cpu.bmi);
  init_op(cpu, [[0xd0, memory.relative]], cpu.bne);
  init_op(cpu, [[0x10, memory.relative]], cpu.bpl);
  init_op(cpu, [[0x50, memory.relative]], cpu.bvc);
  init_op(cpu, [[0x70, memory.relative]], cpu.bvs);

  // Clear Flag Instructions
  init_op(cpu, [[0x18, null]], cpu.clc);
  init_op(cpu, [[0xd8, null]], cpu.cld);
  init_op(cpu, [[0x58, null]], cpu.cli);
  init_op(cpu, [[0xb8, null]], cpu.clv);

  // Set Flag Instructions
  init_op(cpu, [[0x38, null]], cpu.sec);
  init_op(cpu, [[0xf8, null]], cpu.sed);
  init_op(cpu, [[0x78, null]], cpu.sei);

  // Stack Instructions
  init_op(cpu, [[0x48, null]], cpu.pha);
  init_op(cpu, [[0x08, null]], cpu.php);
  init_op(cpu, [[0x68, null]], cpu.pla);
  init_op(cpu, [[0x28, null]], cpu.plp);

  // Transfer Instructions
  init_op(cpu, [[0xaa, null]], cpu.tax);
  init_op(cpu, [[0xa8, null]], cpu.tay);
  init_op(cpu, [[0xba, null]], cpu.tsx);
  init_op(cpu, [[0x8a, null]], cpu.txa);
  init_op(cpu, [[0x9a, null]], cpu.txs);
  init_op(cpu, [[0x98, null]], cpu.tya);
}

function init_op (cpu, versions, method) {
  versions.forEach( version => {
    let [op, addr_mode] = version;
    cpu.opcodes[op] = function () {
      cpu.pc += 1;
      method(addr_mode);
    };
  });
}

export { init };
