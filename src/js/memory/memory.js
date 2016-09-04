import { Cartridge } from "./cart";
import { NROM, MMC1, MMC3 } from "./mappers";

class Memory {

  constructor () {
    this.mapper = null;
    this.memory = new Uint8Array(0x800);
  }

  initMapper (cart) {
    switch (cart.header.mapperId) {
    case 0:
      this.mapper = new NROM(cart); break;
    case 1:
      this.mapper = new MMC1(cart); break;
    case 4:
      this.mapper = new MMC3(cart); break;
    default:
      console.error("This mapper is not supported yet. Sorry!");
    }
  }

  swapCart (data) {
    let cart = new Cartridge(data);
    this.initMapper(cart);
    console.log(this.mapper);
  }

  loadWord (address) {
    return this.load(address) + (this.load(address + 1) << 8);
  }

  load (address) {
    if (address < 0x2000) {
      return this.memory[address & 0x7ff];
    } else if (address < 0x4000) {
      // load from PPU
      return "not implemented";
    } else if (address === 0x4016) {
      // load from Input
      return "not implemented";
    } else if (address < 0x4019) {
      // load from APU
      return "not implemented";
    } else if (address < 0x6000) {
      // load from SRAM
      return "not implemented";
    } else {
      return this.mapper.load(address);
    }
  }

  store (address, value) {
    if (address < 0x2000) {
      return this.memory[address & 0x7ff] = value;
    } else if (address < 0x4000) {
      // store into PPU
      return "not implemented";
    } else if (address === 0x4016) {
      // store into Input
      return "not implemented";
    } else if (address < 0x4019) {
      // store into APU
      return "not implemented";
    } else if (address < 0x6000) {
      // store into SRAM
      return "not implemented";
    } else {
      return this.mapper.store(address, value);
    }
  }

  //
  // Addressing Modes
  //

  // REMINDER: The operator precedence of + is greater than &.
  // FIXME: Handle page wrapping in indirect modes.
  // FIXME: Handle cycle counting correctly. :troll:

  /*

   TODO: Dispatch correctly to PPU/APU/RAM/ROM, etc.

   Raw ops == JSR/JMP and Accumulator calls.
   Deref == operate on the byte *at* the address.
   Getters always deref except for raw ops.
   Setters always deref except for Accumulator calls.

  */

  immediate (cpu) {
    return cpu.pc;
  }

  accumulator (cpu) {
    return cpu.acc;
  }

  zeroPage (cpu) {
    return this.load(cpu.pc);
  }

  zeroPageX (cpu) {
    let start = this.load(cpu.pc);
    let address = start + cpu.xReg & 0xff;
    return address;
  }

  zeroPageY (cpu) {
    let start = this.load(cpu.pc);
    let address = start + cpu.yReg & 0xff;
    return address;
  }

  absolute (cpu) {
    return this.loadWord(cpu.pc);
  }

  absoluteX (cpu) {
    let start = this.loadWord(cpu.pc);
    let address = start + cpu.xReg & 0xffff;
    return address;
  }

  absoluteY (cpu) {
    let start = this.loadWord(cpu.pc);
    let address = start + cpu.yReg & 0xffff;
    return address;
  }

  // NOTE: Indirect is only used by JMP.
  indirect (cpu) {
    let start = this.loadWord(cpu.pc);
    let address = this.loadWord(start);
    return address;
  }

  indirectX (cpu) {
    let start = this.load(cpu.pc);
    let indirect = start + cpu.xReg & 0xff;
    let address = this.loadWord(indirect);
    return address;
  }

  indirectY (cpu) {
    let start = this.load(cpu.pc);
    let indirect = start + cpu.yReg & 0xff;
    let address = this.loadWord(indirect);
    return address;
  }

  relative (cpu) {
    let offset = this.load(cpu.pc);
    let direction = offset & 0x80;
    let address;

    /*
     The top bit in the offset is a direction,
     with 1 meaning go back and 0 meaning go forwards.
     Note that negative numbers are in two's complement.
     See: https://en.wikipedia.org/wiki/Two%27s_complement
     */

    if (direction === 0) {
      address = cpu.pc + offset & 0xffff;
    } else {
      let signed = (offset ^ 0xff) + 1;
      address = cpu.pc - signed & 0xffff;
    }

    return address;
  }

}

export { Memory };
