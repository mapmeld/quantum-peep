import { ProgramStep } from './programstep';

export class ExtraGate extends ProgramStep {
  name: string;
  qubits: Array<number>;
  static validGates: Array<string> = [
    'CNOT', 'CCNOT', 'CZ',
    'CH', 'CRZ', 'CXBASE', 'CY',
    'SWAP', 'CSWAP', 'ISWAP', 'PSWAP',
    'RX', 'RY', 'RZ'
  ];

  constructor (name: string, qubits: Array<number>) {
    super();
    if (ExtraGate.validGates.indexOf(name.toUpperCase()) === -1) {
      throw new Error('Gate type unknown');
    }
    this.name = name.toUpperCase();
    this.qubits = qubits;
  }

  qasmVersion (quil_name: string) {
    quil_name = quil_name.toLowerCase();
    switch (quil_name) {
      case 'ccnot':
        return 'ccx';
      case 'cnot':
        return 'cx';
      case 'cxbase':
        return 'CX'; // this uppercase is unusual, but in QASM docs
      default:
        return quil_name;
    }
  }

  qubitsUsed () {
    return this.qubits;
  }

  code (language: string) {
    if (language === 'quil') {
      if (['CH', 'CRZ', 'CXBASE', 'CY'].indexOf(this.name) > -1) {
        throw new Error(`${this.name} operation not supported on Quil`);
      }
      return `${this.name} ${this.qubits.join(' ')}`;
    } else if (language === 'q#') {
      if (['CSWAP', 'ISWAP', 'CZ', 'CH', 'CRZ', 'CXBASE', 'CY'].indexOf(this.name) > -1) {
        throw new Error(`${this.name} operation not supported on Q#`);
      }
      return `${this.name}(${this.qubits.join(', ')});`;
    } else if (language === 'qasm') {
      if (['ISWAP'].indexOf(this.name) > -1) {
        throw new Error(`${this.name} operation not supported on QASM`);
      }
      return `${this.qasmVersion(this.name)} ${this.qubits.map(q => `q[${q}]`).join(',')};`;
    }
    return '';
  }
}

export class PhaseGate extends ExtraGate {
  angle: string;

  constructor (name: string, qubits: Array<number>, angle: string) {
    super(name, qubits);
    this.name = name;
    this.angle = angle;
  }

  code (language: string) {
    if (language === 'quil') {
      return `${this.name.toUpperCase()}(${this.angle}) ${this.qubits.join(' ')}`;
    } else if (language === 'q#') {
      if (['PSWAP'].indexOf(this.name) > -1) {
        throw new Error(`${this.name} operation not supported on Q#`);
      }
      if (isNaN(Number(this.angle))) {
        if (this.angle.replace(/[\s\d\/\*]/g, '').replace(/pi/ig, '').length === 0) {
          let anglenum = eval(this.angle.replace('pi', 'Math.PI')).toFixed(3);
          return `${this.name}(${anglenum}, ${this.qubits.join(', ')});`;
        } else {
          throw new Error('Cannot parse advanced math to double for Q# output');
        }
      } else {
        return `${this.name}(${this.angle}, ${this.qubits.join(', ')});`;
      }
    } else if (language === 'qasm') {
      if (['PSWAP'].indexOf(this.name) > -1) {
        throw new Error(`${this.name} operation not supported on QASM`);
      }
      return `${this.qasmVersion(this.name)}(${this.angle}) ${this.qubits.map(q => `q[${q}]`).join(',')};`;
    }
    return '';
  }
}

export const CNOT = (q1: number, q2: number) => {
  return new ExtraGate('CNOT', [q1, q2]);
};

export const CCNOT = (q1: number, q2: number, q3: number) => {
  return new ExtraGate('CCNOT', [q1, q2, q3]);
};

export const CZ = (q1: number, q2: number) => {
  return new ExtraGate('CZ', [q1, q2]);
};

export const SWAP = (q1: number, q2: number) => {
  return new ExtraGate('SWAP', [q1, q2]);
};

export const CSWAP = (q1: number, q2: number, q3: number) => {
  return new ExtraGate('CSWAP', [q1, q2, q3]);
};

export const ISWAP = (q1: number, q2: number) => {
  return new ExtraGate('ISWAP', [q1, q2]);
};

export const PSWAP = (angle: string, q1: number, q2: number) => {
  return new PhaseGate('PSWAP', [q1, q2], angle);
};

export const RX = (angle: string, q1: number) => {
  return new PhaseGate('Rx', [q1], angle);
};

export const RY = (angle: string, q1: number) => {
  return new PhaseGate('Ry', [q1], angle);
};

export const RZ = (angle: string, q1: number) => {
  return new PhaseGate('Rz', [q1], angle);
};

// IBM only?
export const CH = (q1: number, q2: number) => {
  return new ExtraGate('CH', [q1, q2]);
};
export const CRZ = (angle: string, q1: number, q2: number) => {
  return new PhaseGate('CRZ', [q1, q2], angle);
};
export const CXBASE = (q1: number, q2: number) => {
  return new ExtraGate('CXBASE', [q1, q2]);
};
export const CY = (q1: number, q2: number) => {
  return new ExtraGate('CY', [q1, q2]);
};
