import { initOpcodes } from "./init";
import { Enum } from "enumify";

class Flag extends Enum {}
Flag.initEnum(["CARRY", "ZERO", "INTERRUPT", "DECIMAL",
               "BREAK", "UNUSED", "OVERFLOW", "NEGATIVE"]);

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

    initOpcodes(this, this.memory);
    this.reset();
  }

  reset () {
    this.pc = this.memory.getWord(0xfffc);
  }

  getFlag (flag) {
    let bitmask = 1 << Flag[flag].ordinal;
    return this.status & bitmask;
  }

  setFlag (flag) {
    let bitmask = 1 << Flag[flag].ordinal;
    return this.status |= bitmask;
  }

  clearFlag (flag) {
    let bitmask = 1 << Flag[flag].ordinal;
    return this.status &= ~bitmask;
  }

  setFlagZN (value) {
    if (value === 0) { this.setFlag("ZERO"); }
    if (value & 0x80) { this.setFlag("NEGATIVE"); }
  }

  branchIf (jump) {
    if (jump) {
      this.pc = this.memory.relative(this);
    } else {
      this.pc += 1;
    }
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

  /*

   ==================
    CPU Instructions
   ==================

   */

  // FIXME: Figure out addressing mode calling variations!
  // i.e. raw mode, etc. Set up differently in initOps?
  // Remember this includes accumulator modes for asl, etc

  adc (addrMode) {
  }

  and (addrMode) {
  }

  asl (addrMode) {
  }

  bcc (addrMode) {
    this.branchIf(this.getFlag("CARRY") === 0);
  }

  bcs (addrMode) {
    this.branchIf(this.getFlag("CARRY") !== 0);
  }

  beq (addrMode) {
    this.branchIf(this.getFlag("ZERO") !== 0);
  }

  bit (addrMode) {
  }

  bmi (addrMode) {
    this.branchIf(this.getFlag("NEGATIVE") !== 0);
  }

  bne (addrMode) {
    this.branchIf(this.getFlag("ZERO") === 0);
  }

  bpl (addrMode) {
    this.branchIf(this.getFlag("NEGATIVE") === 0);
  }

  brk (addrMode) {
  }

  bvc (addrMode) {
    this.branchIf(this.getFlag("OVERFLOW") === 0);
  }

  bvs (addrMode) {
    this.branchIf(this.getFlag("OVERFLOW") !== 0);
  }

  clc (addrMode) {
    this.clearFlag("CARRY");
  }

  cld (addrMode) {
    this.clearFlag("DECIMAL");
  }

  cli (addrMode) {
    this.clearFlag("INTERRUPT");
  }

  clv (addrMode) {
    this.clearFlag("OVERFLOW");
  }

  cmp (addrMode) {
  }

  cpx (addrMode) {
  }

  cpy (addrMode) {
  }

  dec (addrMode) {
  }

  dex (addrMode) {
  }

  dey (addrMode) {
  }

  eor (addrMode) {
  }

  inc (addrMode) {
  }

  inx (addrMode) {
  }

  iny (addrMode) {
  }

  jmp (addrMode) {
  }

  jsr (addrMode) {
  }

  lda (addrMode) {
  }

  ldx (addrMode) {
  }

  ldy (addrMode) {
  }

  lsr (addrMode) {
  }

  nop (addrMode) {
  }

  ora (addrMode) {
  }

  pha (addrMode) {
  }

  php (addrMode) {
  }

  pla (addrMode) {
  }

  plp (addrMode) {
  }

  rol (addrMode) {
  }

  ror (addrMode) {
  }

  rti (addrMode) {
  }

  rts (addrMode) {
  }

  sbc (addrMode) {
  }

  sec (addrMode) {
    this.setFlag("CARRY");
  }

  sed (addrMode) {
    this.setFlag("DECIMAL");
  }

  sei (addrMode) {
    this.setFlag("INTERRUPT");
  }

  sta (addrMode) {
  }

  stx (addrMode) {
  }

  sty (addrMode) {
  }

  tax (addrMode) {
    this.xReg = this.acc;
    this.setFlagZN(this.xReg);
  }

  tay (addrMode) {
    this.yReg = this.acc;
    this.setFlagZN(this.yReg);
  }

  tsx (addrMode) {
    this.xReg = this.sp;
    this.setFlagZN(this.xReg);
  }

  txa (addrMode) {
    this.acc = this.xReg;
    this.setFlagZN(this.acc);
  }

  txs (addrMode) {
    this.sp = this.xReg;
  }

  tya (addrMode) {
    this.acc = this.yReg;
    this.setFlagZN(this.acc);
  }

}

export { Cpu };
