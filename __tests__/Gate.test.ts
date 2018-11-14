import { Gates } from '../src';
test('Gate X', () => {
  let xgate = Gates.X(1);
  expect(xgate.code('quil')).toBe('X 1');
  expect(xgate.code('qasm')).toBe('x q[1];');
});
