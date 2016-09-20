/*

    As the PPU is a complicated and tangly piece of tech,
    various references were consulted in the process of
    writing this code. A few are listed here:

  * [1] http://nesdev.icequake.net/nes.txt
  * [2] http://problemkaputt.de/everynes.txt -- I/O Map section especially
  * [3] http://wiki.nesdev.com/w/index.php/PPU_registers
  * [4] http://wiki.nesdev.com/w/index.php/PPU_scrolling
  * [5] http://wiki.nesdev.com/w/index.php/PPU_rendering
  * [6] http://www.thealmightyguru.com/Games/Hacking/Wiki/index.php?title=NES_Palette
  * [7] https://opcode-defined.quora.com/
  * [8] http://forums.nesdev.com/viewtopic.php?f=2&t=6424

 */

const PALETTE = [
  0x7C, 0x7C, 0x7C, 0x00, 0x00, 0xFC, 0x00, 0x00, 0xBC,
  0x44, 0x28, 0xBC, 0x94, 0x00, 0x84, 0xA8, 0x00, 0x20,
  0xA8, 0x10, 0x00, 0x88, 0x14, 0x00, 0x50, 0x30, 0x00,
  0x00, 0x78, 0x00, 0x00, 0x68, 0x00, 0x00, 0x58, 0x00,
  0x00, 0x40, 0x58, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0xBC, 0xBC, 0xBC, 0x00, 0x78, 0xF8,
  0x00, 0x58, 0xF8, 0x68, 0x44, 0xFC, 0xD8, 0x00, 0xCC,
  0xE4, 0x00, 0x58, 0xF8, 0x38, 0x00, 0xE4, 0x5C, 0x10,
  0xAC, 0x7C, 0x00, 0x00, 0xB8, 0x00, 0x00, 0xA8, 0x00,
  0x00, 0xA8, 0x44, 0x00, 0x88, 0x88, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xF8, 0xF8, 0xF8,
  0x3C, 0xBC, 0xFC, 0x68, 0x88, 0xFC, 0x98, 0x78, 0xF8,
  0xF8, 0x78, 0xF8, 0xF8, 0x58, 0x98, 0xF8, 0x78, 0x58,
  0xFC, 0xA0, 0x44, 0xF8, 0xB8, 0x00, 0xB8, 0xF8, 0x18,
  0x58, 0xD8, 0x54, 0x58, 0xF8, 0x98, 0x00, 0xE8, 0xD8,
  0x78, 0x78, 0x78, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0xFC, 0xFC, 0xFC, 0xA4, 0xE4, 0xFC, 0xB8, 0xB8, 0xF8,
  0xD8, 0xB8, 0xF8, 0xF8, 0xB8, 0xF8, 0xF8, 0xA4, 0xC0,
  0xF0, 0xD0, 0xB0, 0xFC, 0xE0, 0xA8, 0xF8, 0xD8, 0x78,
  0xD8, 0xF8, 0x78, 0xB8, 0xF8, 0xB8, 0xB8, 0xF8, 0xD8,
  0x00, 0xFC, 0xFC, 0xF8, 0xD8, 0xF8, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00
];

class PPU {

  constructor () {
    // REMINDER: 6502 uses little-endian byte ordering.
    this.cycle = 0;
    this.scanline = 0;

    // REMINDER: The pattern table data is in cart CHR ROM/RAM.
    this.VRAM = {
      nameTables: new Uint8Array(0x800),
      paletteTable: new Uint8Array(0x20)
    };
    this.OAM = new Uint8Array(0x100);
    this.mapper = null;

    // NOTE: Find a cleaner way to represent scroll? :-/
    this.registers = {
      control:     0,
      mask:        0,
      status:      0,
      oam_address: 0,
      buffer:      0,
      scroll:      {
        x:     0,
        y:     0,
        next:  "X"
      },
      address:     {
        value: 0,
        temp:  0,
        byte:  "High"
      },
      fineX:   0,
      fineY:   0
    };

  }

  reset () {
    this.cycle = 340;
    this.scanline = 240;
    this.registers.control = 0;
    this.registers.mask = 0;
    this.registers.oam_address = 0;
  }

  load (address) {
    let result = null;
    switch (address & 7) {
    case 2:
      // TODO: This badly needs an overhaul.
      this.registers.scroll.next = "X";
      this.registers.address.byte = "High";
      result = this.registers.status; break;
    case 4:
      // NOTE: "Never meant to be read"? [8]
      result = this.OAM[this.oam_address];
    case 7:
      result = this.loadPPU(); break;
    case 0:  // PPU Control, Write Only.
    case 1:  // PPU Mask, Write Only.
    case 3:  // SPR-RAM Address, Write Only.
    case 5:  // PPU Scroll, Write Only.
    case 6:  // PPU Address, Write Only.
      result = 0; break;
    }
    return result;
   }

  store (address, value) {
    switch (address & 7) {
    case 0:
      this.registers.control = value; break;
      // TODO: Maybe some nmiChange stuff here?
    case 1:
      this.registers.mask = value; break;
    case 2:
      break; // NOTE: PPU Status, Read only!
    case 3:
      this.registers.oam_address = value; break;
    case 4:
      this.OAM[this.oam_address] = value;
      this.oam_address += 1; break;
    case 5:
      this.updateScroll(value); break;
    case 6:
      this.updatePpuAddress(value); break;
    case 7:
      this.storePPU(value); break;
    }
  }

  loadPPU () {
    let address = this.registers.address.value;
    let data = this.loadVRAM(address);
    this.updateVramAddress();

    // Emulate buffered reads. PPUDATA so goofy.
    if (address < 0x3f00) {
      // Destructuring swap. Buffer the data, return what was buffered.
      [this.registers.buffer, data] = [data, this.registers.buffer];
      return data;
    } else {
      return data;
    }
  }

  loadVRAM (address) {
    if (address < 0x2000) {
      return this.mapper.loadChr(address);
    } else if (address < 0x3f00) {
      // TODO: Handle mirroring here!!!
      return this.vram.nameTables[address & 0x7ff];
    } else {
      return this.loadPalette(address & 0x1f);
    }
  }

  storePPU (value) {
    this.storeVRAM(value);
    this.updateVramAddress();
  }

  storeVRAM (value) {
    let address = this.registers.address.value;

    if (address < 0x2000) {
      this.mapper.storeChr(address, value);
    } else if (address < 0x3f00) {
      // TODO: Handle mirroring here!!!
      this.vram.nameTables[address & 0x7ff] = value;
    } else {
      this.storePalette(address, value);
    }

    this.updateVramAddress();
  }

  backgroundPaletteHack (address) {
    if (address > 0x0f && address % 4 === 0) {
      // The background colors are mirrored to the sprites here.
      return address - 16;
    } else {
      // Just use the address as normal.
      return address;
    }
  }

  loadPalette (address) {
    let index = this.backgroundPaletteHack(address);
    return this.vram.paletteTable[index];
  }

  storePalette (address, value) {
    let index = this.backgroundPaletteHack(address);
    this.vram.paletteTable[index] = value;
  }

  updatePpuAddress (value) {
    let previous = this.registers.address.value;
    let newAddress = null;
    if (this.registers.address.next === "High") {
      newAddress = previous & 0x00ff | (value << 8);
      this.registers.address.next = "Low";
    } else {
      newAddress = previous & 0xff00 | value;
      this.registers.address.next = "High";
    }
    this.registers.address.value = newAddress;
  }

  updateVramAddress () {
    let incrementBit = this.registers.control & 0x04;
    if (incrementBit === 0) {
      this.registers.address.value += 1;
    } else {
      this.registers.address.value += 32;
    }
  }

}

export { PPU };
