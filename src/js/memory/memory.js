import { Cartridge } from "./cart";
import { NROM, MMC1, UNROM, CNROM, MMC3 } from "./mappers";

const MAPPERS = {
  0: NROM,
  1: MMC1,
  2: UNROM,
  3: CNROM
};

class Memory {

  constructor (ppu) {
    this.mapper = null;
    this.memory = new Uint8Array(0x800);
    this.ppu    = ppu;
  }

  initMapper (cart) {
    let mapper = MAPPERS[cart.header.mapperId];
    if (mapper) {
      this.mapper = new mapper(cart);
      this.ppu.mapper = this.mapper;
    } else {
      console.error("This mapper is not supported yet. Sorry!");
    }
  }

  swapCart (data) {
    let cart = new Cartridge(data);
    this.initMapper(cart);
    console.log(this.mapper);
  }

  getRange (start, end) {
    let results = [];
    for (var i = start; i < end; i++) {
      results.push(this.load(i));
    }
    return results;
  }

  pageCrossed (start, end) {
    // Ignore the low byte. Are the high bytes different?
    return start & 0xff00 != end & 0xff00;
  }

  loadIndirect (address) {
    let wrapped  = address & 0xff00 + (address + 1 & 0xff);
    let lowByte  = this.load(address);
    let highByte = this.load(wrapped);

    return highByte << 8 + lowByte;
  }

  loadWord (address) {
    let lowByte  = this.load(address);
    let highByte = this.load(address + 1);

    return highByte << 8 + lowByte;
  }

  load (address) {
    if (address < 0x2000) {
      return this.memory[address & 0x7ff];
    } else if (address < 0x4000) {
      return this.ppu.load(address);
    } else if (address === 0x4016) {
      // load from Input
      return 0; // Not implemented yet!
    } else if (address < 0x4019) {
      // load from APU
      return 0; // Not implemented yet!
    } else if (address < 0x8000) {
      // load from SRAM
      return 0; // Not implemented yet!
    } else {
      return this.mapper.load(address);
    }
  }

  store (address, value) {
    if (address < 0x2000) {
      return this.memory[address & 0x7ff] = value;
    } else if (address < 0x4000) {
      return this.ppu.store(address, value);
    } else if (address === 0x4016) {
      // store into Input
      return "not implemented";
    } else if (address < 0x4019) {
      // store into APU
      return "not implemented";
    } else if (address < 0x8000) {
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
  // FIXME: Handle cycle counting correctly. :troll:

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

  /*

  NOTE: Indirect is only used by JMP.
  indirectX adds register before load, indirectY does after.
  They also load wrapping the low byte but not the high byte.

   */

  indirect (cpu) {
    let start = this.loadWord(cpu.pc);
    let address = this.loadIndirect(start);
    return address;
  }

  indirectX (cpu) {
    let start = this.load(cpu.pc) + cpu.xReg;
    let address = this.loadIndirect(start);
    return address;
  }

  indirectY (cpu) {
    let start = this.load(cpu.pc);
    let address = this.loadIndirect(start) + cpu.yReg;
    return address;
  }

  relative (cpu) {
    let offset = this.load(cpu.pc);
    let directionBit = offset >> 7;
    let address;

    /*
     Remember that negative numbers are in two's complement.
     See: https://en.wikipedia.org/wiki/Two%27s_complement

     The Two's Complement value is given by (x ^ 0xff) + 1
     but we just use (x ^ 0xff) here since our cpu.step()
     has the PC pointing to the offset, not the next opcode.
     */

    if (directionBit === 0) {
      address = cpu.pc + offset & 0xffff;
    } else {
      offset = offset ^ 0xff;
      address = cpu.pc - offset & 0xffff;
    }

    return address;
  }

}

export { Memory };
