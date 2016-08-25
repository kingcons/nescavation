import { Cartridge } from "./cart";

class Memory {

  constructor () {
    this.cart = null;
    this.memory = new Uint8Array(0x10000);
  }

  swapCart (data) {
    this.cart = new Cartridge(data);
    console.log(this.cart);
  }

  get_word (address) {
    return this.memory[address] + (this.memory[address + 1] << 8);
  }

  //
  // Addressing Modes
  //

  // REMINDER: The operator precedence of + is greater than &.
  // FIXME: Handle page wrapping in indirect modes.
  // FIXME: Handle cycle counting correctly. :troll:

  /*

   TODO: Dispatch correctly to PPU/APU/RAM/ROM, etc.

   At present, we're just reading this.memory directly.
   In the future, we should do "the right thing" by
   checking what region the address is in.

   Ultimately, any CPU instruction has an addressing mode
   that addressing mode returns a u16 into memory,
   and we may then read a byte or write a byte to that
   location.

   The right thing to do is probably replace any
   direct calls to this.memory[...] with load/store
   methods that dispatch correctly to the underlying HW.

   This will require reworking the opcodes slightly
   and figuring out if we need any tweaks for "raw"
   opcodes. Perhaps we can build closures in the opcode
   initialization for getting and setting? We've got to
   extend that to accurately track program counter at
   some point too.

  */

  immediate (cpu) {
    return this.memory[cpu.pc];
  }

  accumulator (cpu, raw) {
    if (raw) {
      return cpu.acc;
    } else {
      return this.memory[cpu.acc];
    }
  }

  zero_page (cpu, raw) {
    let address = this.memory[cpu.pc];
    return raw ? address : this.memory[address];
  }

  zero_page_x (cpu, raw) {
    let start = this.memory[cpu.pc];
    let address = start + cpu.xReg & 0xff;
    return raw ? address : this.memory[address];
  }

  zero_page_y (cpu, raw) {
    let start = this.memory[cpu.pc];
    let address = start + cpu.yReg & 0xff;
    return raw ? address : this.memory[address];
  }

  absolute (cpu, raw) {
    let address = get_word(cpu.pc);
    return raw ? address : this.memory[address];
  }

  absolute_x (cpu, raw) {
    let start = get_word(cpu.pc);
    let address = start + cpu.xReg & 0xffff;
    return raw ? address : this.memory[address];
  }

  absolute_y (cpu, raw) {
    let start = get_word(cpu.pc);
    let address = start + cpu.yReg & 0xffff;
    return raw ? address : this.memory[address];
  }

  // NOTE: Indirect is only used by JMP.
  indirect (cpu) {
    let start = get_word(cpu.pc);
    let address = get_word(start);
    return address;
  }

  indirect_x (cpu, raw) {
    let start = this.memory[cpu.pc];
    let indirect = start + cpu.xReg & 0xff;
    let address = get_word(indirect);
    return raw ? address : this.memory[address];
  }

  indirect_y (cpu, raw) {
    let start = this.memory[cpu.pc];
    let indirect = start + cpu.yReg & 0xff;
    let address = get_word(indirect);
    return raw ? address : this.memory[address];
  }

  relative (cpu) {
    let offset = this.memory[cpu.pc];
    let direction = offset & 0x80;

    /*
     The top bit in the offset is a direction,
     with 1 meaning go back and 0 meaning go forwards.
     Note that negative numbers are in two's complement.
     See: https://en.wikipedia.org/wiki/Two%27s_complement
     */

    if (direction === 0) {
      let address = cpu.pc + offset & 0xffff;
    } else {
      let signed = (offset ^ 0xff) + 1;
      let address = cpu.pc - signed & 0xffff;
    }

    return address;
  }

}

export { Memory };
