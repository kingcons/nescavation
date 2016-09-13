function disasmTmpl (rows) {
  return `
  <div class="tile is-child">
    <table class="table disasm-table">
      <thead>
        <tr>
          <th>Address</th>
          <th>Hexdump</th>
          <th>Disassembly</th>
        </tr>
      </thead>
      <tbody>
        ${rows.map(disasmRowTmpl).join("")}
      </tbody>
    </table>
  </div>
    `;
}

function disasmRowTmpl ([address, hex, disasm]) {
  return `
  <tr>
    <td>${address}</td>
    <td>${hex}</td>
    <td>${disasm}</td>
  </tr>
    `;
}

export { disasmTmpl };
