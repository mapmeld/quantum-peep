import { Gates } from '../src';

test('Gate X (one qubit)', () => {
  let xgate = Gates.X(1);
  expect(xgate.code('quil')).toBe('X 1');
  expect(xgate.code('qasm')).toBe('x q[1];');
  expect(xgate.code('q#')).toBe('X(1);');
});

test('Gate I/ID (different names, same output)', () => {
  let igate = Gates.I(1);
  let idgate = Gates.ID(1);
  expect(igate.code('quil')).toBe('I 1');
  expect(igate.code('qasm')).toBe('id q[1];');
  expect(igate.code('q#')).toBe('I(1);');
  expect(idgate.code('quil')).toBe('I 1');
  expect(idgate.code('qasm')).toBe('id q[1];');
  expect(idgate.code('q#')).toBe('I(1);');
});

test('Gate Dagger S', () => {
  let sdg = Gates.SDAG(1);
  expect(sdg.code('quil')).toBe('DAGGER S 1');
  expect(sdg.code('qasm')).toBe('sdg q[1];');
  //expect(sdg.code('q#')).toBe('DAGGER S(1);');
});

test('Gate T and add DAGGER later', () => {
  let tdg = Gates.T(1);
  tdg.dagger();
  expect(tdg.code('quil')).toBe('DAGGER T 1');
  expect(tdg.code('qasm')).toBe('tdg q[1];');
  expect(() => { tdg.code('q#') }).toThrow(Error);

  // subsequent adds don't do anything (should this throw an error?)
  tdg.dagger();
  expect(tdg.code('quil')).toBe('DAGGER T 1');

});

test('DAGGER X only supported by some platforms', () => {
  let x = Gates.X(1);
  x.dagger();
  expect(x.code('quil')).toBe('DAGGER X 1');
  expect(() => { x.code('qasm') }).toThrow(Error);
  expect(() => { x.code('q#') }).toThrow(Error);
});

test('CNOT/CX gates', () => {
  let cc = Gates.CNOT(1, 2);
  expect(cc.code('quil')).toBe('CNOT 1 2');
  expect(cc.code('qasm')).toBe('cx q[1],q[2];');
  expect(cc.code('q#')).toBe('CNOT(1, 2);');

  let cc2 = Gates.CX(1, 2);
  expect(cc2.code('quil')).toBe('CNOT 1 2');
  expect(cc2.code('qasm')).toBe('cx q[1],q[2];');
  expect(cc2.code('q#')).toBe('CNOT(1, 2);');

  let cc3 = Gates.CXBASE(1, 2);
  expect(() => { cc3.code('quil') }).toThrow(Error);
  expect(cc3.code('qasm')).toBe('CX q[1],q[2];');
  expect(() => { cc3.code('q#') }).toThrow(Error);
});

test('CCNOT/CCX gates', () => {
  let cc = Gates.CCNOT(1, 2, 3);
  expect(cc.code('quil')).toBe('CCNOT 1 2 3');
  expect(cc.code('qasm')).toBe('ccx q[1],q[2],q[3];');
  expect(cc.code('q#')).toBe('CCNOT(1, 2, 3);');

  let cc2 = Gates.CCX(1, 2, 3);
  expect(cc2.code('quil')).toBe('CCNOT 1 2 3');
  expect(cc2.code('qasm')).toBe('ccx q[1],q[2],q[3];');
  expect(cc2.code('q#')).toBe('CCNOT(1, 2, 3);');
});

test('SWAP gates', () => {
  let sw = Gates.SWAP(1, 2);
  expect(sw.code('quil')).toBe('SWAP 1 2');
  expect(sw.code('qasm')).toBe('swap q[1],q[2];');
  expect(sw.code('q#')).toBe('SWAP(1, 2);');

  let sw2 = Gates.CSWAP(1, 2, 3);
  expect(sw2.code('quil')).toBe('CSWAP 1 2 3');
  expect(sw2.code('qasm')).toBe('cswap q[1],q[2],q[3];');
  expect(() => { sw2.code('q#') }).toThrow(Error);

  let sw3 = Gates.ISWAP(1, 2);
  expect(sw3.code('quil')).toBe('ISWAP 1 2');
  expect(() => { sw3.code('qasm') }).toThrow(Error);
  expect(() => { sw3.code('q#') }).toThrow(Error);

  let sw4 = Gates.PSWAP('pi', 1, 2);
  expect(sw4.code('quil')).toBe('PSWAP(pi) 1 2');
  expect(() => { sw4.code('qasm') }).toThrow(Error);
  expect(() => { sw4.code('q#') }).toThrow(Error);
});

test('RX / RY / RZ gate', () => {
  let rx = Gates.RX('3.14', 1);
  expect(rx.code('quil')).toBe('RX(3.14) 1');
  expect(rx.code('qasm')).toBe('rx(3.14) q[1];');
  expect(rx.code('q#')).toBe('Rx(3.14, 1);');

  let rx2 = Gates.RY('pi/2', 2);
  expect(rx2.code('quil')).toBe('RY(pi/2) 2');
  expect(rx2.code('qasm')).toBe('ry(pi/2) q[2];');
  expect(rx2.code('q#')).toBe('Ry(1.571, 2);');

  let rx3 = Gates.RZ('pi[1]', 3);
  expect(() => { rx3.code('q#') }).toThrow(Error);
});
