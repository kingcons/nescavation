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

  /*

   Note: The invariant we maintain here is that the CPU Stack
   Pointer always points to the top of the stack/unused memory.

   It's unclear what should happen if a word is pushed/popped
   across the stack boundary, e.g. 0x101 / 0x1ff

   */

  stackPush (value) {
    let address = 0x100 + this.sp;
    this.memory.store(address, value & 0xff);
    this.sp = this.sp - 1 & 0xff;
  }

  stackPushWord (value) {
    this.stackPush(value >> 8);
    this.stackPush(value & 0xff);
  }

  stackPop () {
    this.sp = this.sp + 1 & 0xff;
    return this.memory.load(this.sp + 0x100);
  }

  stackPopWord () {
    return this.stackPop() + (this.stackPop() << 8);
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

   Remaining: asl, bit, cmp, cpx, cpy, dec, eor, inc, lda, ldx, ldy, lsr, ora, rol, ror, sbc, sta, stx, sty

   */

  // FIXME: Figure out addressing mode calling variations!
  // i.e. raw mode, etc. Set up differently in initOps?
  // Remember this includes accumulator modes for asl, etc

  adc (addrMode) {
    let result = this.acc + addrMode(this) + this.getFlag("CARRY");
    // TODO: Handle overflow.
    if (result > 0xff) { this.setFlag("CARRY"); }
    if (result & 0xff === 0) { this.setFlag("ZERO"); }
    if (result & 0x80) { this.setFlag("NEGATIVE"); }
    this.acc = result & 0xff;
  }

  and (addrMode) {
    let result = this.acc & addrMode(this);
    if (result === 0) { this.setFlag("ZERO"); }
    if (result & 0x80) { this.setFlag("NEGATIVE"); }
    this.acc = result;
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
    // FIXME: Should we really be incrementing here?
    let pc = this.pc + 1 & 0xffff;
    this.stackPushWord(pc);
    this.setFlag("BREAK");
    this.stackPush(this.status);
    this.setFlag("INTERRUPT");
    this.pc = this.memory.getWord(0xfffe);
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
    this.xReg = this.xReg - 1 & 0xff;
    this.setFlagNZ(this.xReg);
  }

  dey (addrMode) {
    this.yReg = this.yReg - 1 & 0xff;
    this.setFlagNZ(this.yReg);
  }

  eor (addrMode) {
  }

  inc (addrMode) {
  }

  inx (addrMode) {
    this.xReg = this.xReg + 1 & 0xff;
    this.setFlagNZ(this.xReg);
  }

  iny (addrMode) {
    this.yReg = this.yReg + 1 & 0xff;
    this.setFlagNZ(this.yReg);
  }

  jmp (addrMode) {
    let jumpTo = addrMode(this);
    this.pc = jumpTo;
  }

  jsr (addrMode) {
    // Add 2 to move over the jump address to the next opcode.
    let returnTo = this.pc + 2 & 0xffff;
    this.stackPushWord(returnTo);
    let jumpTo = addrMode(this);
    this.pc = jumpTo;
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

  // FIXME: Any status flag tweaks needed in PHP/PLP?

  pha (addrMode) {
    this.stackPush(this.acc);
  }

  php (addrMode) {
    this.stackPush(this.status);
  }

  pla (addrMode) {
    this.acc = this.stackPop();
    this.setFlagNZ(this.acc);
  }

  plp (addrMode) {
    this.status = this.stackPop();
  }

  rol (addrMode) {
  }

  ror (addrMode) {
  }

  rti (addrMode) {
    this.status = this.stackPop() | 0x20;
    this.pc = this.stackPopWord();
  }

  rts (addrMode) {
    this.pc = this.stackPopWord();
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
