const TWO_BYTE_MODES = ["absolute", "absoluteX", "absoluteY", "indirect"];

const FORMATTERS = {
  "implied":      () => "",
  "accumulator":  () => "A",
  "immediate":    immediateArgs,
  "zeroPage":     zeroPageArgs,
  "zeroPageX":    zeroPageXArgs,
  "zeroPageY":    zeroPageYArgs,
  "absolute":     absoluteArgs,
  "absoluteX":    absoluteXArgs,
  "absoluteY":    absoluteYArgs,
  "indirect":     indirectArgs,
  "indirectX":    indirectXArgs,
  "indirectY":    indirectYArgs,
  "relative":     relativeArgs
};

function padWith (string, length, char) {
  while (string.length < length) {
    string = char + string;
  }
  return string;
}

function toHex (number, length=2) {
  let hexStr = number.toString(16);
  return padWith(hexStr, length, 0);
}

function hexify(args, joiner="") {
  return args.map(x => toHex(x)).join(joiner);
}

function immediateArgs (args) {
  return `#$${hexify(args)}`;
}

function zeroPageArgs (args) {
  return `$${hexify(args)}`;
}

function zeroPageXArgs (args) {
  return `$${hexify(args)},X`;
}

function zeroPageYArgs (args) {
  return `$${hexify(args)},Y`;
}

function absoluteArgs (args) {
  return `$${hexify(args)}`;
}

function absoluteXArgs (args) {
  return `$${hexify(args)},X`;
}

function absoluteYArgs (args) {
  return `$${hexify(args)},Y`;
}

function indirectArgs (args) {
  return `($${hexify(args)})`;
}

function indirectXArgs (args) {
  return `($${hexify(args)},X)`;
}

function indirectYArgs (args) {
  return `($${hexify(args)}),Y`;
}

// TODO: Same as Zero Page for now. Add label support!
function relativeArgs (args) {
  return `$${hexify(args)}`;
}

function disassembleOp (opsInfo, code) {
  let [op, ...args] = code;
  let opInfo = opsInfo[op];
  let formatter = FORMATTERS[opInfo.addrMode];

  // NOTE: Remember 6502 is little endian!
  if (TWO_BYTE_MODES.includes(opInfo.addrMode)) {
    args = args.reverse();
  }

  return `${opInfo.name} ${formatter(args)}`;
}

function isOp (opsInfo, byte) {
  return opsInfo[byte] !== undefined;
}

function findNextSegment (opsInfo, start, bytes) {
  let op = bytes[start];
  let segment = null;

  // KLUDGE: Naively assume that START is an op.
  // Deciding what is code vs data in arbitrary memory
  // regions is non-trivial and not undertaken here.

  if (opsInfo[op]) {
    let end = start + opsInfo[op].size;
    segment = bytes.slice(start, end);
  } else {
    let end = bytes.slice(start).find(x => isOp(opsInfo, x));
    segment = bytes.slice(start, end);
  }

  return segment;
}

function disassemble (opsInfo, start, size, bytes) {
  let results = [];
  let count = 0;

  while (count < size) {
    let segment = findNextSegment(opsInfo, count, bytes);
    let isCode  = isOp(opsInfo, segment[0]);

    let address = toHex(start + count, 4);
    let hexdump = hexify(segment, " ");
    let disasm  = isCode ? disassembleOp(opsInfo, segment) : null;

    results.push([address, hexdump, disasm]);
    count += segment.length;
  }

  return results;
}

function disassembleRange (cpu, size) {
  let bytes = cpu.memory.getRange(cpu.pc, cpu.pc + size + 4);
  return disassemble(cpu.opsInfo, cpu.pc, size, bytes);
}

export { disassemble, disassembleRange };
