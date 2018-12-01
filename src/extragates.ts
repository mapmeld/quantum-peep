import { ProgramStep } from './programstep';

export class ExtraGate extends ProgramStep {
  name: string;
  qubits: Array<number>;
  static validGates: Array<string> = ['SWAP'];

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
    return quil_name;
  }

  qubitsUsed () {
    return this.qubits;
  }

  code (language: string) {
    if (language === 'quil') {
      return `${this.name} ${this.qubits.join(' ')}`;
    } else if (language === 'q#') {
      return `${this.name}(${this.qubits.join(', ')});`;
    } else if (language === 'qasm') {
      return `${this.qasmVersion(this.name)} ${this.qubits.map(q => `q[${q}]`).join(',')};`;
    }
    return '';
  }
}

export const SWAP = (q1: number, q2: number) => {
  return new ExtraGate('SWAP', [q1, q2]);
};
