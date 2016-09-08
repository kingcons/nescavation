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

  constructor (cart) {}

  load (address) {}

  store (address, value) {}

}

class MMC3 {

  constructor (cart) {}

  load (address) {}

  store (address, value) {}

}

export { NROM, MMC1, MMC3 };
