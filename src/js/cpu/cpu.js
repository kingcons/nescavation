import { init_opcodes } from "./init";

class Cpu {

  constructor (memory) {
    this.paused   = true;
    this.pc       = 0;      // Program Counter
    this.sp       = 0xfd;   // Stack Pointer
    this.status   = 0x24;   // Status Register
    this.acc      = 0;      // Accumulator
    this.xReg     = 0;      // X Register
    this.yReg     = 0;      // Y Register
    this.memory   = memory;
    this.opcodes  = {};

    init_opcodes(this, this.memory);
    this.reset();
  }

  reset () {
    this.pc = this.memory.get_word(0xfffc);
  }

  run () {
    // while (!this.paused) {
    //   this.step();
    // }
  }

  step () {
    let instruction = this.memory.immediate(this);
    console.log("Instruction", instruction);
    console.log("Opcode", this.opcodes[instruction]);
    console.log("Cpu", this);
    return this.opcodes[instruction]();
  }

  adc (addr_mode) {
  }

  and (addr_mode) {
  }

  asl (addr_mode) {
  }

  bcc (addr_mode) {
  }

  bcs (addr_mode) {
  }

  beq (addr_mode) {
  }

  bit (addr_mode) {
  }

  bmi (addr_mode) {
  }

  bne (addr_mode) {
  }

  bpl (addr_mode) {
  }

  brk (addr_mode) {
  }

  bvc (addr_mode) {
  }

  bvs (addr_mode) {
  }

  clc (addr_mode) {
  }

  cld (addr_mode) {
  }

  cli (addr_mode) {
  }

  clv (addr_mode) {
  }

  cmp (addr_mode) {
  }

  cpx (addr_mode) {
  }

  cpy (addr_mode) {
  }

  dec (addr_mode) {
  }

  dex (addr_mode) {
  }

  dey (addr_mode) {
  }

  eor (addr_mode) {
  }

  inc (addr_mode) {
  }

  inx (addr_mode) {
  }

  iny (addr_mode) {
  }

  jmp (addr_mode) {
  }

  jsr (addr_mode) {
  }

  lda (addr_mode) {
  }

  ldx (addr_mode) {
  }

  ldy (addr_mode) {
  }

  lsr (addr_mode) {
  }

  nop (addr_mode) {
  }

  ora (addr_mode) {
  }

  pha (addr_mode) {
  }

  php (addr_mode) {
  }

  pla (addr_mode) {
  }

  plp (addr_mode) {
  }

  rol (addr_mode) {
  }

  ror (addr_mode) {
  }

  rti (addr_mode) {
  }

  rts (addr_mode) {
  }

  sbc (addr_mode) {
  }

  sec (addr_mode) {
  }

  sed (addr_mode) {
  }

  sei (addr_mode) {
  }

  sta (addr_mode) {
  }

  stx (addr_mode) {
  }

  sty (addr_mode) {
  }

  tax (addr_mode) {
  }

  tay (addr_mode) {
  }

  tsx (addr_mode) {
  }

  txa (addr_mode) {
  }

  txs (addr_mode) {
  }

  tya (addr_mode) {
  }

}

export { Cpu };
