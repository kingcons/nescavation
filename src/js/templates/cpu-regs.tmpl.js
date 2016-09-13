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
          <th>Status Register</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>$${cpu.acc.toString(16)}</td>
          <td>$${cpu.xReg.toString(16)}</td>
          <td>$${cpu.yReg.toString(16)}</td>
          <td>$${cpu.pc.toString(16)}</td>
          <td>$${cpu.sp.toString(16)}</td>
          <td>#${cpu.sr.toString(2)}</td>
        </tr>
      </tbody>
    </table>
  `;
}

export { cpuRegTmpl };
