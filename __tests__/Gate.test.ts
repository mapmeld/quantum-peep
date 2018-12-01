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

test('SWAP gates', () => {
  let sw = Gates.SWAP(1, 2);
  expect(sw.code('quil')).toBe('SWAP 1 2');
  expect(sw.code('qasm')).toBe('swap q[1],q[2];');
  expect(sw.code('q#')).toBe('SWAP(1, 2);');
});

test('RX gate', () => {
  let rx = Gates.RX('3.14', 1);
  expect(rx.code('quil')).toBe('RX(3.14) 1');
  expect(rx.code('qasm')).toBe('rx(3.14) q[1];');
  expect(rx.code('q#')).toBe('Rx(3.14, 1);');

  let rx2 = Gates.RX('pi/2', 2);
  expect(rx2.code('quil')).toBe('RX(pi/2) 2');
  expect(rx2.code('qasm')).toBe('rx(pi/2) q[2];');
  expect(rx2.code('q#')).toBe('Rx(1.571, 2);');

  let rx3 = Gates.RX('pi[1]', 3);
  expect(() => { rx3.code('q#') }).toThrow(Error);
});
