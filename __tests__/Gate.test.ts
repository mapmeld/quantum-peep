import { Gates, pi_multiplied_by, pi_divided_by } from '../src';

test('Gate X (one qubit)', () => {
  let xgate = Gates.X(1);
  expect(xgate.code('quil')).toBe('X 1');
  expect(xgate.code('qasm')).toBe('x q[1];');
  expect(xgate.code('qobj')).toBe('{"name":"x","qubits":[1]}');
  expect(xgate.code('q#')).toBe('X(1);');
  expect(xgate.code('cirq')).toBe('cirq.X(q_1)')
});

test('Gate I/ID (different names, same output)', () => {
  let igate = Gates.I(1);
  let idgate = Gates.ID(1);
  expect(igate.code('quil')).toBe('I 1');
  expect(igate.code('qasm')).toBe('id q[1];');
  expect(igate.code('qobj')).toBe('{"name":"id","qubits":[1]}');
  expect(igate.code('q#')).toBe('I(1);');
  expect(() => { igate.code('cirq') }).toThrow(Error);

  expect(idgate.code('quil')).toBe('I 1');
  expect(idgate.code('qasm')).toBe('id q[1];');
  expect(idgate.code('qobj')).toBe('{"name":"id","qubits":[1]}');
  expect(idgate.code('q#')).toBe('I(1);');
  expect(() => { idgate.code('cirq') }).toThrow(Error);
});

test('Gate Dagger S', () => {
  let sdg = Gates.SDAG(1);
  expect(sdg.code('quil')).toBe('DAGGER S 1');
  expect(sdg.code('qasm')).toBe('sdg q[1];');
  expect(sdg.code('qobj')).toBe('{"name":"sdg","qubits":[1]}');
  expect(sdg.code('q#')).toBe('Adjoint S(1);');
  expect(() => { sdg.code('cirq') }).toThrow(Error);
});

test('Gate T and add DAGGER later', () => {
  let tdg = Gates.T(1);
  tdg.dagger();
  expect(tdg.code('quil')).toBe('DAGGER T 1');
  expect(tdg.code('qasm')).toBe('tdg q[1];');
  expect(tdg.code('qobj')).toBe('{"name":"tdg","qubits":[1]}');
  expect(tdg.code('q#')).toBe('Adjoint T(1);');
  expect(() => { tdg.code('cirq') }).toThrow(Error);

  // subsequent adds don't do anything (should this throw an error?)
  tdg.dagger();
  expect(tdg.code('quil')).toBe('DAGGER T 1');
});

test('DAGGER X only supported by some platforms?', () => {
  let x = Gates.X(1);
  x.dagger();
  expect(x.code('quil')).toBe('DAGGER X 1');
  expect(() => { x.code('qasm') }).toThrow(Error);
  expect(() => { x.code('qobj') }).toThrow(Error);
  expect(x.code('q#')).toBe('Adjoint X(1);');
  expect(() => { x.code('cirq') }).toThrow(Error);
});

test('CNOT/CX gates', () => {
  let cc = Gates.CNOT(1, 2);
  expect(cc.code('quil')).toBe('CNOT 1 2');
  expect(cc.code('qasm')).toBe('cx q[1],q[2];');
  expect(cc.code('qobj')).toBe('{"name":"cx","qubits":[1,2]}');
  expect(cc.code('q#')).toBe('CNOT(1, 2);');
  expect(cc.code('cirq')).toBe('cirq.CNOT(q_1, q_2)');

  let cc2 = Gates.CX(1, 2);
  expect(cc2.code('quil')).toBe('CNOT 1 2');
  expect(cc2.code('qasm')).toBe('cx q[1],q[2];');
  expect(cc2.code('qobj')).toBe('{"name":"cx","qubits":[1,2]}');
  expect(cc2.code('q#')).toBe('CNOT(1, 2);');
  expect(cc.code('cirq')).toBe('cirq.CNOT(q_1, q_2)');

  let cc3 = Gates.CXBASE(1, 2);
  expect(() => { cc3.code('quil') }).toThrow(Error);
  expect(cc3.code('qasm')).toBe('CX q[1],q[2];');
  expect(cc3.code('qobj')).toBe('{"name":"CX","qubits":[1,2]}');
  expect(() => { cc3.code('q#') }).toThrow(Error);
  expect(() => { cc3.code('cirq') }).toThrow(Error);

  let cc4 = Gates.CY(1, 2);
  expect(cc4.code('quil')).toBe('CONTROLLED Y 1 2');
  expect(cc4.code('qasm')).toBe('cy q[1],q[2];');
  expect(cc4.code('qobj')).toBe('{"name":"cy","qubits":[1,2]}');
  expect(cc4.code('q#')).toBe('Controlled Y([1], 2);');
  expect(() => { cc4.code('cirq') }).toThrow(Error);
});

test('CCNOT/CCX gates', () => {
  let cc = Gates.CCNOT(1, 2, 3);
  expect(cc.code('quil')).toBe('CCNOT 1 2 3');
  expect(cc.code('qasm')).toBe('ccx q[1],q[2],q[3];');
  expect(cc.code('qobj')).toBe('{"name":"ccx","qubits":[1,2,3]}');
  expect(cc.code('q#')).toBe('CCNOT(1, 2, 3);');
  expect(() => { cc.code('cirq') }).toThrow(Error);

  let cc2 = Gates.CCX(1, 2, 3);
  expect(cc2.code('quil')).toBe('CCNOT 1 2 3');
  expect(cc2.code('qasm')).toBe('ccx q[1],q[2],q[3];');
  expect(cc2.code('qobj')).toBe('{"name":"ccx","qubits":[1,2,3]}');
  expect(cc2.code('q#')).toBe('CCNOT(1, 2, 3);');
  expect(() => { cc2.code('cirq') }).toThrow(Error);
});

test('SWAP gates', () => {
  let sw = Gates.SWAP(1, 2);
  expect(sw.code('quil')).toBe('SWAP 1 2');
  expect(sw.code('qasm')).toBe('swap q[1],q[2];');
  expect(sw.code('qobj')).toBe('{"name":"swap","qubits":[1,2]}');
  expect(sw.code('q#')).toBe('SWAP(1, 2);');
  expect(sw.code('cirq')).toBe('cirq.SWAP(q_1, q_2)');

  let sw2 = Gates.CSWAP(1, 2, 3);
  expect(sw2.code('quil')).toBe('CSWAP 1 2 3');
  expect(sw2.code('qasm')).toBe('cswap q[1],q[2],q[3];');
  expect(sw2.code('qobj')).toBe('{"name":"cswap","qubits":[1,2,3]}');
  expect(sw2.code('q#')).toBe('Controlled SWAP([1], 2, 3);');
  expect(sw2.code('cirq')).toBe('cirq.CSWAP(q_1, q_2, q_3)');

  let sw3 = Gates.ISWAP(1, 2);
  expect(sw3.code('quil')).toBe('ISWAP 1 2');
  expect(() => { sw3.code('qasm') }).toThrow(Error);
  expect(() => { sw3.code('qobj') }).toThrow(Error);
  expect(() => { sw3.code('q#') }).toThrow(Error);
  expect(sw3.code('cirq')).toBe('cirq.ISWAP(q_1, q_2)');

  let sw4 = Gates.PSWAP(pi_multiplied_by(1), 1, 2);
  expect(sw4.code('quil')).toBe('PSWAP(1pi) 1 2');
  expect(() => { sw4.code('qasm') }).toThrow(Error);
  expect(() => { sw4.code('qobj') }).toThrow(Error);
  expect(() => { sw4.code('q#') }).toThrow(Error);
  expect(() => { sw4.code('cirq') }).toThrow(Error);
});

test('RX / RY / RZ gate', () => {
  let rx = Gates.RX(pi_multiplied_by(1), 1);
  expect(rx.code('quil')).toBe('RX(1pi) 1');
  expect(rx.code('qasm')).toBe('rx(1pi) q[1];');
  expect(rx.code('qobj')).toBe('{"name":"rx","params":[3.141592653589793],"qubits":[1]}');
  expect(rx.code('q#')).toBe('Rx(3.142, 1);');
  expect(rx.code('cirq')).toBe('cirq.X(q_1) ** 1.000');

  let rx2 = Gates.RY(pi_divided_by(2), 2);
  expect(rx2.code('quil')).toBe('RY(pi/2) 2');
  expect(rx2.code('qasm')).toBe('ry(pi/2) q[2];');
  expect(rx2.code('qobj')).toBe('{"name":"ry","params":[1.5707963267948966],"qubits":[2]}');
  expect(rx2.code('q#')).toBe('Ry(1.571, 2);');
  expect(rx2.code('cirq')).toBe('cirq.Y(q_2) ** 0.500');
});
