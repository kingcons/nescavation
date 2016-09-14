// References:
//   * http://tuxnes.sourceforge.net/mappers-0.80.txt
//   * http://nesdev.com/mmc1.txt
//   * https://wiki.nesdev.com/w/index.php/MMC1

class NROM {

  constructor (cart) {
    this.cart = cart;
  }

  load (address) {
    if (this.cart.prgCount === 1) {
      return this.cart.prgData[address & 0x3fff];
    } else {
      return this.cart.prgData[address & 0x7fff];
    }
  }

  store (address, value) {
    return null;
  }

  loadChr (address) {
    return this.cart.chrData[address];
  }

  storeChr (address, value) {
    return null;
  }

}

class MMC1 {

  constructor (cart) {
    this.cart = cart;
    this.registers = {
      control:  0x0c,
      chrBank1: 0,
      chrBank2: 0,
      prgBank:  0
    };
    this.accumulator = 0;
    this.writeCount  = 0;
  }

  reset () {
    this.registers.control = this.registers.control | 0x0c;
    this.accumulator = 0;
    this.writeCount = 0;
  }

  updateRegister (address) {
    if (address < 0xA000) {
      this.registers.control = this.accumulator;
    } else if (address < 0xC000) {
      this.registers.chrBank1 = this.accumulator;
    } else if (address < 0xE000) {
      this.registers.chrBank2 = this.accumulator;
    } else {
      this.registers.prgBank = this.accumulator;
    }
  }

  getPrgMode () {
    let prgBits = this.registers.control >> 2 & 3;
    let mode = null;

    switch (prgBits) {
    case 0:
    case 1:
      mode = "32K";
    case 2:
      mode = "FixLow";
    case 3:
      mode = "FixHigh";
    }

    return mode;
  }

  getLowBank () {
    let mode = this.getPrgMode();
    let bank = null;

    switch (mode) {
    case "32K":
      bank = this.registers.prgBank & 0xfe;
    case "FixLow":
      bank = 0;
    case "FixHigh":
      bank = this.registers.prgBank;
    }

    return bank;
  }

  getHighBank () {
    let mode = this.getPrgMode();
    let bank = null;

    switch (mode) {
    case "32K":
      bank = this.registers.prgBank | 1;
    case "FixLow":
      bank = this.registers.prgBank;
    case "FixHigh":
      bank = this.cart.header.prgCount - 1;
    }

    return bank;
  }

  load (address) {
    let bankOffset;

    if (address < 0xC000) {
      let bankOffset = this.getLowBank() * 0x4000;
    } else {
      let bankOffset = this.getHighBank() * 0x4000;
    }

    let index = bankOffset + (address & 0x3fff);
    return this.cart.prgData[index];
  }

  store (address, value) {
    let resetBit = value & 0x80;
    if (resetBit !== 0) {
      this.reset();
      return;
    }

    let updateBit = (value & 1) << this.writeCount;
    this.accumulator = this.accumulator | updateBit;

    if (this.writeCount === 5) {
      this.updateRegister(address);
      this.writeCount = 0;
      this.accumulator = 0;
    }
  }

  loadChr (address) {
    let bank = address < 0x1000 ? this.registers.chrBank1 : this.registers.chrBank2;
    let index = bank * 0x1000 + (address & 0xfff);
    return this.cart.chrData[index];
  }

  storeChr (address, value) {
    let bank = address < 0x1000 ? this.registers.chrBank1 : this.registers.chrBank2;
    let index = bank * 0x1000 + (address & 0xfff);
    return this.cart.chrData[index] = value;
  }

}

class UNROM {

  constructor (cart) {
    this.cart = cart;
    this.prgBank1 = 0;
    this.prgBank2 = cart.header.prgCount - 1;
  }

  load (address) {
    let bankOffset;

    if (address < 0xC000) {
      bankOffset = this.prgBank1 * 0x4000;
    } else {
      bankOffset = this.prgBank2 * 0x4000;
    }

    let index = bankOffset + (address & 0x3fff);
    return this.cart.prgData[index];
  }

  store (address, value) {
    this.prgBank1 = value & 0xf;
  }

  loadChr (address) {
    return this.cart.chrData[address];
  }

  storeChr (address, value) {
    return this.cart.chrData[address] = value;
  }

}

class CNROM {

  constructor (cart) {
    this.cart = cart;
    this.chrBank  = 0;
    this.prgBank1 = 0;
    this.prgBank2 = cart.header.prgCount - 1;
  }

  load (address) {
    let bankOffset;

    if (address < 0xC000) {
      bankOffset = this.prgBank1 * 0x4000;
    } else {
      bankOffset = this.prgBank2 * 0x4000;
    }

    let index = bankOffset + (address & 0x3fff);
    return this.cart.prgData[index];
  }

  store (address, value) {
    this.chrBank = value & 0x3;
  }

  loadChr (address) {
    let index = this.chrBank * 0x2000 + (address & 0x1fff);
    return this.cart.chrData[index];
  }

  storeChr (address, value) {
    let index = this.chrBank * 0x2000 + (address & 0x1fff);
    return this.cart.chrData[index] = value;
  }

}

class MMC3 {

  constructor (cart) {}

  load (address) {}

  store (address, value) {}

}

export { NROM, MMC1, UNROM, CNROM, MMC3 };
