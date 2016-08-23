class Cpu {

  constructor (memory) {
    this.acc    = 0; // Accumulator
    this.xReg   = 0; // X Register
    this.yReg   = 0; // Y Register
    this.status = 0; // Status Register
    this.pc     = 0; // Program Counter
    this.sp     = 0; // Stack Pointer
    this.memory = memory;
    this.opcodes = {};

    this.init();
  }

  init () {
    let adc = [[0x61, this.memory.indirect_x],
               [0x65, this.memory.zero_page],
               [0x69, this.memory.immediate],
               [0x6d, this.memory.absolute],
               [0x71, this.memory.indirect_y],
               [0x75, this.memory.zero_page_x],
               [0x79, this.memory.absolute_y],
               [0x7d, this.memory.absolute_x]];
    init_op(adc, this.adc);

    let and = [[0x21, this.memory.indirect_x],
               [0x25, this.memory.zero_page],
               [0x29, this.memory.immediate],
               [0x2d, this.memory.absolute],
               [0x31, this.memory.indirect_y],
               [0x35, this.memory.zero_page_x],
               [0x39, this.memory.absolute_y],
               [0x3d, this.memory.absolute_x]];
    init_op(and, this.and);

    let asl = [[0x06, this.memory.zero_page],
               [0x0a, this.memory.accumulator],
               [0x0e, this.memory.absolute],
               [0x16, this.memory.zero_page_x],
               [0x1e, this.memory.absolute_x]];
    init_op(asl, this.asl);

    let bit = [[0x24, this.memory.zero_page],
               [0x2c, this.memory.absolute]];
    init_op(bit, this.bit);

    init_op([[0x00, null]], this.brk);

    let cmp = [[0xc1, this.memory.indirect_x],
               [0xc5, this.memory.zero_page],
               [0xc9, this.memory.immediate],
               [0xcd, this.memory.absolute],
               [0xd1, this.memory.indirect_y],
               [0xd5, this.memory.zero_page_x],
               [0xd9, this.memory.absolute_y],
               [0xdd, this.memory.absolute_x]];
    init_op(cmp, this.cmp);

    let cpx = [[0xe0, this.memory.immediate],
               [0xe4, this.memory.zero_page],
               [0xec, this.memory.absolute]];
    init_op(cpx, this.cpx);

    let cpy = [[0xc0, this.memory.immediate],
               [0xc4, this.memory.zero_page],
               [0xcc, this.memory.absolute]];
    init_op(cpy, this.cpy);

    let dec = [[0xc6, this.memory.zero_page],
               [0xce, this.memory.absolute],
               [0xd6, this.memory.zero_page_x],
               [0xde, this.memory.absolute_x]];
    init_op(dec, this.dec);

    init_op([[0xca, null]], this.dex);
    init_op([[0x88, null]], this.dey);

    let eor = [[0x41, this.memory.indirect_x],
               [0x45, this.memory.zero_page],
               [0x49, this.memory.immediate],
               [0x4d, this.memory.absolute],
               [0x51, this.memory.indirect_y],
               [0x55, this.memory.zero_page_x],
               [0x59, this.memory.absolute_y],
               [0x5d, this.memory.absolute_x]];
    init_op(eor, this.eor);

    let inc = [[0xe6, this.memory.zero_page],
               [0xee, this.memory.absolute],
               [0xf6, this.memory.zero_page_x],
               [0xfe, this.memory.absolute_x]];
    init_op(inc, this.inc);

    init_op([[0xe8, null]], this.inx);
    init_op([[0xc8, null]], this.iny);

    let jmp = [[0x4c, this.memory.absolute],
               [0x6c, this.memory.indirect]];
    init_op(jmp, this.jmp);

    init_op([[0x20, this.memory.absolute]], this.jsr);

    let lda = [[0xa1, this.memory.indirect_x],
               [0xa5, this.memory.zero_page],
               [0xa9, this.memory.immediate],
               [0xad, this.memory.absolute],
               [0xb1, this.memory.indirect_y],
               [0xb5, this.memory.zero_page_x],
               [0xb9, this.memory.absolute_y],
               [0xbd, this.memory.absolute_x]];
    init_op(lda, this.lda);

    let ldx = [[0xa2, this.memory.immediate],
               [0xa6, this.memory.zero_page],
               [0xae, this.memory.absolute],
               [0xb6, this.memory.zero_page_y],
               [0xbe, this.memory.absolute_y]];
    init_op(ldx, this.ldx);

    let ldy = [[0xa0, this.memory.immediate],
               [0xa4, this.memory.zero_page],
               [0xac, this.memory.absolute],
               [0xbc, this.memory.absolute_x],
               [0xb4, this.memory.zero_page_x]];
    init_op(ldy, this.ldy);

    let lsr = [[0x46, this.memory.zero_page],
               [0x4a, this.memory.accumulator],
               [0x4e, this.memory.absolute],
               [0x56, this.memory.zero_page_x],
               [0x5e, this.memory.absolute_x]];
    init_op(lsr, this.lsr);

    init_op([[0xea, null]], this.nop);

    let ora = [[0x01, this.memory.indirect_x],
               [0x05, this.memory.zero_page],
               [0x09, this.memory.immediate],
               [0x0d, this.memory.absolute],
               [0x11, this.memory.indirect_y],
               [0x15, this.memory.zero_page_x],
               [0x19, this.memory.absolute_y],
               [0x1d, this.memory.absolute_x]];
    init_op(ora, this.ora);

    let rol = [[0x2a, this.memory.accumulator],
               [0x26, this.memory.zero_page],
               [0x2e, this.memory.absolute],
               [0x36, this.memory.zero_page_x],
               [0x3e, this.memory.absolute_x]];
    init_op(rol, this.rol);

    let ror = [[0x66, this.memory.zero_page],
               [0x6a, this.memory.accumulator],
               [0x6e, this.memory.absolute],
               [0x76, this.memory.zero_page_x],
               [0x7e, this.memory.absolute_x]];
    init_op(ror, this.ror);

    init_op([[0x40, null]], this.rti);
    init_op([[0x60, null]], this.rts);

    let sbc = [[0xe1, this.memory.indirect_x],
               [0xe5, this.memory.zero_page],
               [0xe9, this.memory.immediate],
               [0xed, this.memory.absolute],
               [0xf1, this.memory.indirect_y],
               [0xf5, this.memory.zero_page_x],
               [0xf9, this.memory.absolute_y],
               [0xfd, this.memory.absolute_x]];
    init_op(sbc, this.sbc);

    let sta = [[0x81, this.memory.indirect_x],
               [0x85, this.memory.zero_page],
               [0x8d, this.memory.absolute],
               [0x91, this.memory.indirect_y],
               [0x95, this.memory.zero_page_x],
               [0x99, this.memory.absolute_y],
               [0x9d, this.memory.absolute_x]];
    init_op(sta, this.sta);

    let stx = [[0x86, this.memory.zero_page],
               [0x8e, this.memory.absolute],
               [0x96, this.memory.zero_page_y]];
    init_op(stx, this.stx);

    let sty = [[0x84, this.memory.zero_page],
               [0x8c, this.memory.absolute],
               [0x96, this.memory.zero_page_x]];
    init_op(sty, this.sty);

    // Branch Instructions
    init_op([[0x90, this.memory.relative]], this.bcc);
    init_op([[0xb0, this.memory.relative]], this.bcs);
    init_op([[0xf0, this.memory.relative]], this.beq);
    init_op([[0x30, this.memory.relative]], this.bmi);
    init_op([[0xd0, this.memory.relative]], this.bne);
    init_op([[0x10, this.memory.relative]], this.bpl);
    init_op([[0x50, this.memory.relative]], this.bvc);
    init_op([[0x70, this.memory.relative]], this.bvs);

    // Clear Flag Instructions
    init_op([[0x18, null]], this.clc);
    init_op([[0xd8, null]], this.cld);
    init_op([[0x58, null]], this.cli);
    init_op([[0xb8, null]], this.clv);

    // Set Flag Instructions
    init_op([[0x38, null]], this.sec);
    init_op([[0xf8, null]], this.sed);
    init_op([[0x78, null]], this.sei);

    // Stack Instructions
    init_op([[0x48, null]], this.pha);
    init_op([[0x08, null]], this.php);
    init_op([[0x68, null]], this.pla);
    init_op([[0x28, null]], this.plp);

    // Transfer Instructions
    init_op([[0xaa, null]], this.tax);
    init_op([[0xa8, null]], this.tay);
    init_op([[0xba, null]], this.tsx);
    init_op([[0x8a, null]], this.txa);
    init_op([[0x9a, null]], this.txs);
    init_op([[0x98, null]], this.tya);
  }

  init_op (versions, method) {
    versions.forEach( (op, addr_mode) => {
      this.opcodes[op] = function (cpu) {
        cpu.pc += 1;
        method(addr_mode);
      };
    });
  }

  adc () {
  }

  and () {
  }

  asl () {
  }

  bcc () {
  }

  bcs () {
  }

  beq () {
  }

  bit () {
  }

  bmi () {
  }

  bne () {
  }

  bpl () {
  }

  brk () {
  }

  bvc () {
  }

  bvs () {
  }

  clc () {
  }

  cld () {
  }

  cli () {
  }

  clv () {
  }

  cmp () {
  }

  cpx () {
  }

  cpy () {
  }

  dec () {
  }

  dex () {
  }

  dey () {
  }

  eor () {
  }

  inc () {
  }

  inx () {
  }

  iny () {
  }

  jmp () {
  }

  jsr () {
  }

  lda () {
  }

  ldx () {
  }

  ldy () {
  }

  lsr () {
  }

  nop () {
  }

  ora () {
  }

  pha () {
  }

  php () {
  }

  pla () {
  }

  plp () {
  }

  rol () {
  }

  ror () {
  }

  rti () {
  }

  rts () {
  }

  sbc () {
  }

  sec () {
  }

  sed () {
  }

  sei () {
  }

  sta () {
  }

  stx () {
  }

  sty () {
  }

  tax () {
  }

  tay () {
  }

  tsx () {
  }

  txa () {
  }

  txs () {
  }

  tya () {
  }

}

export { Cpu };
