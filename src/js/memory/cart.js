const MAPPERS = {
  0: "No Mapper/NROM",
  1: "MMC1",
  2: "UNROM",
  3: "CNROM",
  4: "MMC3",
  5: "MMC5"
};

class Cartridge {

  constructor (data) {
    let header = data.splice(0, 16);
    let mapperHighBits = header[7] >>> 4;
    let mapperLowBits  = header[6] >>> 4;
    let mapperId = Math.pow(mapperHighBits, 4) + mapperLowBits;

    // TODO: Actually assert that header[0..4] == [78, 69, 83, 26]
    // TODO: Actually assert that header[11..15] are all 0

    this.header = {
      prgCount: header[4],
      prgSize:  header[4] * Math.pow(2, 14),
      chrCount: header[5],
      chrSize:  header[5] * Math.pow(2, 13),
      ramCount: header[8],
      mapperId: mapperId,
      mapperName: MAPPERS[mapperId],
      mirroring: header[6] & 255 ? "vertical" : "horizontal"
    };

    this.prgData = data.splice(0, this.header.prgSize);
    this.chrData = data;

  }

}

export { Cartridge };
