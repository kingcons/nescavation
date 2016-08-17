import { Cartridge } from "./cart";

class Memory {

  constructor () {
    this.cart = null;
  }

  swapCart (data) {
    this.cart = new Cartridge(data);
    console.log(this);
  }

}

export { Memory };
