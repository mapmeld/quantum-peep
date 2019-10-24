import { ProgramStep } from './programstep';

export class BasicGate extends ProgramStep {
  name: string;
  inverse: boolean;
  qubits: Array<number>;
  static validGates: Array<string> = ['X', 'Y', 'Z', 'H', 'S', 'T', 'DAGGER S', 'DAGGER T', 'I'];

  constructor (name: string, qubits: Array<number>) {
    super();
    if (BasicGate.validGates.indexOf(name.toUpperCase()) === -1) {
      throw new Error('Gate type unknown');
    }
    this.qubits = qubits;
    this.inverse = (name.indexOf('DAGGER') === 0);
    this.name = name.toUpperCase().replace('DAGGER ', '');
  }

  qasmVersion (quil_name: string) {
    quil_name = quil_name.toLowerCase();
    if (quil_name === 'i') {
      return 'id';
    } else if (this.inverse) {
      if (quil_name === 's') {
        return 'sdg';
      } else if (quil_name === 't') {
        return 'tdg';
      } else {
        throw new Error('Dagger of gates other than S and T not supported for IBM');
      }
    }
    return quil_name;
  }

  cirqVersion (quil_name: string) {
    quil_name = quil_name.toUpperCase();
    if (quil_name === 'I') {
      throw new Error('Identity gate unknown in Cirq');
    }
    if (this.inverse) {
      throw new Error('No dagger gates supported in Cirq');
    }
    return quil_name;
  }

  dagger () {
    this.inverse = true;
  }

  adjoint () {
    this.inverse = true;
  }

  qubitsUsed () {
    return this.qubits;
  }

  code (language: string) {
    if (language === 'quil') {
      return `${this.inverse ? 'DAGGER ' : ''}${this.name} ${this.qubits.join(' ')}`;
    } else if (language === 'q#') {
      return `${this.inverse ? 'Adjoint ' : ''}${this.name}(${this.qubits.join(' ')});`;
    } else if (language === 'qasm') {
      return `${this.qasmVersion(this.name)} q[${this.qubits.join(' ')}];`;
    } else if (language === 'qobj') {
      return `{"name":"${this.qasmVersion(this.name)}","qubits":[${this.qubits.join(',')}]}`;
    } else if (language === 'cirq') {
      return `cirq.${this.cirqVersion(this.name)}(${this.qubits.map(q => `q_${q}`).join(', ')})`;
    }
    return '';
  }
}
