import { ProgramStep } from './programstep';

class ExtraGate extends ProgramStep {
  name: string;
  qubits: Array<number>;
  static validGates: Array<string> = ['SWAP', 'RX', 'RY', 'RZ'];

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

class PhaseGate extends ExtraGate {
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
      return `${this.qasmVersion(this.name)}(${this.angle}) ${this.qubits.map(q => `q[${q}]`).join(',')};`;
    }
    return '';
  }
}

export const SWAP = (q1: number, q2: number) => {
  return new ExtraGate('SWAP', [q1, q2]);
};

export const RX = (angle: string, q1: number) => {
  return new PhaseGate('Rx', [q1], angle);
};
