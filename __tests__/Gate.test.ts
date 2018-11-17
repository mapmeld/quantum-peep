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
