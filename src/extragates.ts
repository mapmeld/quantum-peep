import { ProgramStep } from './programstep';

export class ExtraGate extends ProgramStep {
  name: string;
  qubits: Array<number>;
  static validGates: Array<string> = [
    'CNOT', 'CCNOT', 'CZ',
    'Controlled H', 'Controlled Rz', 'CXBASE', 'Controlled Y',
    'SWAP', 'CSWAP', 'ISWAP', 'PSWAP',
    'Rx', 'Ry', 'Rz'
  ];

  constructor (name: string, qubits: Array<number>) {
    super();
    if (ExtraGate.validGates.indexOf(name) === -1) {
      throw new Error('Gate type unknown');
    }
    this.name = name;
    this.qubits = qubits;
  }

  qasmVersion (quil_name: string) {
    quil_name = quil_name.toLowerCase().replace('controlled ', 'c');
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

  cirqVersion (quil_name: string) {
    quil_name = quil_name.toUpperCase();
    if (['CXBASE', 'CCNOT', 'PSWAP', 'CONTROLLED Y'].indexOf(quil_name) > -1) {
      throw new Error('Gate not supported in Cirq');
    }
    if (quil_name[0] === 'R') {
      quil_name = quil_name.substring(1);
    }
    return quil_name;
  }

  qubitsUsed () {
    return this.qubits;
  }

  code (language: string) {
    if (language === 'quil') {
      if (['CXBASE'].indexOf(this.name) > -1) {
        throw new Error(`${this.name} operation not supported on Quil`);
      }
      return `${this.name.toUpperCase()} ${this.qubits.join(' ')}`;
    } else if (language === 'q#') {
      if (['ISWAP', 'CXBASE'].indexOf(this.name) > -1) {
        throw new Error(`${this.name} operation not supported on Q#`);
      }
      let qsGate = this.name;
      if (['CSWAP', 'CZ'].indexOf(qsGate) > -1) {
        qsGate = qsGate.replace('C', 'Controlled ');
      }
      if (qsGate.indexOf('Controlled') > -1) {
        return `${qsGate}([${this.qubits[0]}], ${this.qubits.slice(1).join(', ')});`;
      } else {
        return `${qsGate}(${this.qubits.join(', ')});`;
      }
    } else if (language === 'qasm') {
      if (['ISWAP'].indexOf(this.name) > -1) {
        throw new Error(`${this.name} operation not supported on QASM`);
      }
      return `${this.qasmVersion(this.name)} ${this.qubits.map(q => `q[${q}]`).join(',')};`;
    } else if (language === 'qobj') {
      if (['ISWAP'].indexOf(this.name) > -1) {
        throw new Error(`${this.name} operation not supported on Qobj`);
      }
      return `{"name":"${this.qasmVersion(this.name)}","qubits":[${this.qubits.join(',')}]}`;
    } else if (language === 'cirq') {
      return `cirq.${this.cirqVersion(this.name)}(${this.qubits.map(q => `q_${q}`).join(', ')})`;
    }
    return '';
  }
}

export class PhaseGate extends ExtraGate {
  angle: {
    number: number,
    action: string
  };

  constructor (name: string, qubits: Array<number>, angle: { number: number, action: string }) {
    super(name, qubits);
    this.name = name;
    this.angle = angle;
  }

  code (language: string) {
    if (language === 'quil') {
      let anglestr = (this.angle.action === 'multiply') ? (this.angle.number + 'pi') : ('pi/' + this.angle.number);
      return `${this.name.toUpperCase()}(${anglestr}) ${this.qubits.join(' ')}`;
    } else if (language === 'q#') {
      if (['PSWAP'].indexOf(this.name) > -1) {
        throw new Error(`${this.name} operation not supported on Q#`);
      }
      let anglestr = (this.angle.action === 'multiply') ? (Math.PI * this.angle.number) : (Math.PI / this.angle.number);
      return `${this.name}(${anglestr.toFixed(3)}, ${this.qubits.join(', ')});`;
    } else if (language === 'qasm') {
      if (['PSWAP'].indexOf(this.name) > -1) {
        throw new Error(`${this.name} operation not supported on QASM`);
      }
      let anglestr = (this.angle.action === 'multiply') ? (this.angle.number + 'pi') : ('pi/' + this.angle.number);
      return `${this.qasmVersion(this.name)}(${anglestr}) ${this.qubits.map(q => `q[${q}]`).join(',')};`;
    } else if (language === 'qobj') {
      if (['PSWAP'].indexOf(this.name) > -1) {
        throw new Error(`${this.name} operation not supported on Qobj`);
      }
      let anglestr = (this.angle.action === 'multiply') ? (Math.PI * this.angle.number) : (Math.PI / this.angle.number);
      return `{"name":"${this.qasmVersion(this.name)}","params":[${anglestr}],"qubits":[${this.qubits.join(',')}]}`;
    } else if (language === 'cirq') {
      let anglestr = (this.angle.action === 'multiply') ? this.angle.number : (1 / this.angle.number);
      return `cirq.${this.cirqVersion(this.name)}(${this.qubits.map(q => `q_${q}`).join(', ')}) ** ${anglestr.toFixed(3)}`;
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

export const PSWAP = (angle: { number: number, action: string }, q1: number, q2: number) => {
  return new PhaseGate('PSWAP', [q1, q2], angle);
};

export const RX = (angle: { number: number, action: string }, q1: number) => {
  return new PhaseGate('Rx', [q1], angle);
};

export const RY = (angle: { number: number, action: string }, q1: number) => {
  return new PhaseGate('Ry', [q1], angle);
};

export const RZ = (angle: { number: number, action: string }, q1: number) => {
  return new PhaseGate('Rz', [q1], angle);
};

// IBM only?
export const CH = (q1: number, q2: number) => {
  return new ExtraGate('Controlled H', [q1, q2]);
};
export const CRZ = (angle: { number: number, action: string }, q1: number, q2: number) => {
  return new PhaseGate('Controlled Rz', [q1, q2], angle);
};
export const CY = (q1: number, q2: number) => {
  return new ExtraGate('Controlled Y', [q1, q2]);
};
export const CXBASE = (q1: number, q2: number) => {
  return new ExtraGate('CXBASE', [q1, q2]);
};
