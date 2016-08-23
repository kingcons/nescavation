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

  // NOTE: No special handling at present for "raw" opcodes
  // such as: jmp, jsr, asl, lsr, rol, ror
  // REMINDER: The operator precedence of + is greater than &.

  immediate (cpu) {
    return this.memory[cpu.pc];
  }

  zero_page (cpu) {
    let address = this.memory[cpu.pc];
    return this.memory[address];
  }

  zero_page_x (cpu) {
    let start = this.memory[cpu.pc];
    let address = start + cpu.xReg & 0xff;
    return this.memory[address];
  }

  zero_page_y (cpu) {
    let start = this.memory[cpu.pc];
    let address = start + cpu.yReg & 0xff;
    return this.memory[address];
  }

  absolute (cpu) {
    let address = get_word(cpu.pc);
    return this.memory[address];
  }

  absolute_x (cpu) {
    let start = get_word(cpu.pc);
    let address = start + cpu.xReg & 0xffff;
    return this.memory[address];
  }

  absolute_y (cpu) {
    let start = get_word(cpu.pc);
    let address = start + cpu.yReg & 0xffff;
    return this.memory[address];
  }

  // FIXME: Handle page wrapping in indexed indirect modes.

  indirect_x (cpu) {
    let start = this.memory[cpu.pc];
    let indirect = start + cpu.xReg & 0xff;
    let address = get_word(indirect);
    return this.memory[address];
  }

  indirect_y (cpu) {
    let start = this.memory[cpu.pc];
    let indirect = start + cpu.yReg & 0xff;
    let address = get_word(indirect);
    return this.memory[address];
  }

  // FIXME: Handle cycle counting correctly. :troll:

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
