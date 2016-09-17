import { toHex, toBits } from "../utils/disassembler";

function cpuRegTmpl (cpu) {
  return `
    <table class="table">
      <thead>
        <tr>
          <th>Accumulator</th>
          <th>X Register</th>
          <th>Y Register</th>
          <th>Program Counter</th>
          <th>Stack Pointer</th>
          <th>(NV-BDIZC) Status Register</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>$${toHex(cpu.acc)}</td>
          <td>$${toHex(cpu.xReg)}</td>
          <td>$${toHex(cpu.yReg)}</td>
          <td>$${toHex(cpu.pc)}</td>
          <td>$${toHex(cpu.sp)}</td>
          <td>#${toBits(cpu.status)}</td>
        </tr>
      </tbody>
    </table>
  `;
}

export { cpuRegTmpl };
