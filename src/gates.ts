import { BasicGate } from './basicgate';
import { PhaseGate, ExtraGate, SWAP, RX, RY, RZ } from './extragates';

export const Gates = {
  X: (qubit: number) => {
    return new BasicGate('X', [qubit]);
  },
  Y: (qubit: number) => {
    return new BasicGate('Y', [qubit]);
  },
  Z: (qubit: number) => {
    return new BasicGate('Z', [qubit]);
  },
  H: (qubit: number) => {
    return new BasicGate('H', [qubit]);
  },
  S: (qubit: number) => {
    return new BasicGate('S', [qubit]);
  },
  T: (qubit: number) => {
    return new BasicGate('T', [qubit]);
  },
  SDAG: (qubit: number) => {
    return new BasicGate('DAGGER S', [qubit]);
  },
  TDAG: (qubit: number) => {
    return new BasicGate('DAGGER T', [qubit]);
  },

  // aliases for same thing
  I: (qubit: number) => {
    return new BasicGate('I', [qubit]);
  },
  ID: (qubit: number) => {
    return new BasicGate('I', [qubit]);
  },

  // non-basic
  SWAP: SWAP,
  RX: RX,
  RY: RY,
  RZ: RZ

  // CX: (qa: number, qb: number) => {
  //   return new BasicGate('CX', [qa, qb]);
  // }
};
