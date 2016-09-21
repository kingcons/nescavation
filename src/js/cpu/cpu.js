import { initOpcodes } from "./init";
import { Enum } from "enumify";

class Flag extends Enum {}
Flag.initEnum(["CARRY", "ZERO", "INTERRUPT", "DECIMAL",
               "BREAK", "UNUSED", "OVERFLOW", "NEGATIVE"]);

class CPU {

  constructor (memory) {
    this.pc       = 0;      // Program Counter
    this.sp       = 0xfd;   // Stack Pointer
    this.status   = 0x24;   // Status Register
    this.acc      = 0;      // Accumulator
    this.xReg     = 0;      // X Register
    this.yReg     = 0;      // Y Register
    this.memory   = memory;
    this.opcodes  = {};
    this.opsInfo  = {};
    this.cc       = 0;      // Cycle Count

    initOpcodes(this, this.memory);
  }

  reset () {
    this.pc = this.memory.loadWord(0xfffc);
  }

  nmi () {
    this.stackPushWord(this.pc);
    this.stackPush(this.status);
    this.pc = this.memory.loadWord(0xfffa);
    this.cc += 7;
  }

  step () {
    let instruction = this.memory.load(this.pc);
    return this.opcodes[instruction]();
  }

  /* Status Register Utilities */

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

  updateFlag (flag, isEnabled) {
    isEnabled ? this.setFlag(flag) : this.clearFlag(flag);
  }

  setFlagZN (value) {
    this.updateFlag("ZERO", value === 0);
    this.updateFlag("NEGATIVE", value & 0x80);
  }

  /* Branch and Compare Utilities */

  compareMem (register, memory) {
    let result = register - memory;
    this.setFlagZN(result);
    if (result >= 0) { this.setFlag("CARRY"); }
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

  /*

   ==================
    CPU Instructions
   ==================

   */

  // FIXME: Handle overflow in adc, sbc.

  adc (addrMode) {
    let result = this.acc + addrMode.get(this) + this.getFlag("CARRY");
    if (result > 0xff) { this.setFlag("CARRY"); }
    this.setFlagZN(result);
    this.acc = result & 0xff;
  }

  and (addrMode) {
    let result = this.acc & addrMode.get(this);
    this.setFlagZN(result);
    this.acc = result;
  }

  asl (addrMode) {
    let operand = addrMode.get(this);
    let result = operand << 1 & 0xff;
    if (operand & 0x80) { this.setFlag("CARRY"); }
    this.setFlagZN(result);
    addrMode.set(this, result);
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
    let operand = addrMode.get(this);
    if ((operand & 0x40) !== 0) { this.setFlag("OVERFLOW"); }
    if ((operand & 0x80) !== 0) { this.setFlag("NEGATIVE"); }
    if ((operand & this.acc) === 0) { this.setFlag("ZERO"); }
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
    let pc = this.pc + 1 & 0xffff;
    this.stackPushWord(pc);
    this.setFlag("BREAK");
    this.stackPush(this.status);
    this.setFlag("INTERRUPT");
    this.pc = this.memory.loadWord(0xfffe);
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
    this.compareMem(this.acc, addrMode.get(this));
  }

  cpx (addrMode) {
    this.compareMem(this.xReg, addrMode.get(this));
  }

  cpy (addrMode) {
    this.compareMem(this.yReg, addrMode.get(this));
  }

  dec (addrMode) {
    let operand = addrMode.get(this);
    let result = operand - 1 & 0xff;
    addrMode.set(this, result);
    this.setFlagZN(result);
  }

  dex (addrMode) {
    this.xReg = this.xReg - 1 & 0xff;
    this.setFlagZN(this.xReg);
  }

  dey (addrMode) {
    this.yReg = this.yReg - 1 & 0xff;
    this.setFlagZN(this.yReg);
  }

  eor (addrMode) {
    let result = this.acc ^ addrMode.get(this);
    this.setFlagZN(result);
    this.acc = result;
  }

  inc (addrMode) {
    let operand = addrMode.get(this);
    let result = operand + 1 & 0xff;
    addrMode.set(this, result);
    this.setFlagZN(result);
  }

  inx (addrMode) {
    this.xReg = this.xReg + 1 & 0xff;
    this.setFlagZN(this.xReg);
  }

  iny (addrMode) {
    this.yReg = this.yReg + 1 & 0xff;
    this.setFlagZN(this.yReg);
  }

  jmp (addrMode) {
    let jumpTo = addrMode.get(this);
    this.pc = jumpTo;
  }

  jsr (addrMode) {
    // Add 2 to move over the jump address to the next opcode.
    let returnTo = this.pc + 2 & 0xffff;
    this.stackPushWord(returnTo);
    let jumpTo = addrMode.get(this);
    this.pc = jumpTo;
  }

  lda (addrMode) {
    this.acc = addrMode.get(this);
    this.setFlagZN(this.acc);
  }

  ldx (addrMode) {
    this.xReg = addrMode.get(this);
    this.setFlagZN(this.xReg);
  }

  ldy (addrMode) {
    this.yReg = addrMode.get(this);
    this.setFlagZN(this.yReg);
  }

  lsr (addrMode) {
    let operand = addrMode.get(this);
    let result = operand >> 1;
    if (operand & 1 !== 0) { this.setFlag("CARRY"); }
    this.setFlagZN(result);
    addrMode.set(this, result);
  }

  nop (addrMode) {
  }

  ora (addrMode) {
    let result = this.acc | addrMode.get(this);
    this.setFlagZN(result);
    this.acc = result;
  }

  pha (addrMode) {
    this.stackPush(this.acc);
  }

  php (addrMode) {
    this.stackPush(this.status | 0x10);
  }

  pla (addrMode) {
    this.acc = this.stackPop();
    this.setFlagZN(this.acc);
  }

  plp (addrMode) {
    this.status = this.stackPop();
  }

  rol (addrMode) {
    let operand = addrMode.get(this);
    let result = operand << 1 & 0xff;
    if (this.getFlag("CARRY") !== 0) { result |= 0x01; }
    if (operand & 0x80) { this.setFlag("CARRY"); }
    this.setFlagZN(result);
    addrMode.set(this, result);
  }

  ror (addrMode) {
    let operand = addrMode.get(this);
    let result = operand >> 1 & 0xff;
    if (this.getFlag("CARRY") !== 0) { result |= 0x80; }
    if (operand & 1 !== 0) { this.setFlag("CARRY"); }
    this.setFlagZN(result);
    addrMode.set(this, result);
  }

  rti (addrMode) {
    this.status = this.stackPop() | 0x20;
    this.pc = this.stackPopWord();
  }

  rts (addrMode) {
    this.pc = this.stackPopWord();
  }

  sbc (addrMode) {
    let result = this.acc - addrMode.get(this);
    if (this.getFlag("CARRY") === 0) { result -= 1; }
    if (result >= 0) { this.setFlag("CARRY"); }
    this.setFlagZN(result);
    this.acc = result & 0xff;
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
    addrMode.set(this, this.acc);
  }

  stx (addrMode) {
    addrMode.set(this, this.xReg);
  }

  sty (addrMode) {
    addrMode.set(this, this.yReg);
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

export { CPU };
