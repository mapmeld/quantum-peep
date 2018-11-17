
export class ProgramStep {
  code (language: string) {
    return '';
  }

  qubitsUsed () {
    let blank : Array<number> = [];
    return blank;
  }

  registersUsed () {
    let blank : Array<number> = [];
    return blank;
  }
}

export class BasicGate extends ProgramStep {
  name: string;
  qubits: Array<number>;
  static validGates: Array<string> = ['X', 'Y', 'Z', 'H', 'S', 'T', 'DAGGER S', 'DAGGER T', 'I'];

  constructor (name: string, qubits: Array<number>) {
    super();
    if (BasicGate.validGates.indexOf(name.toUpperCase()) === -1) {
      throw new Error('Gate type unknown');
    }
    this.name = name.toUpperCase();
    this.qubits = qubits;
  }

  qasmVersion (quil_name: string) {
    quil_name = quil_name.toLowerCase();
    switch (quil_name) {
      case 'i':
        return 'id';
      case 'dagger s':
        return 'sdg';
      case 'dagger t':
        return 'tdg';
    }
    if (quil_name.indexOf('dagger') === 0) {
      throw new Error('Dagger of gates other than S and T not supported for QASM');
    } else {
      return quil_name;
    }
  }

  dagger () {
    // available on Quil at least
    if (this.name.indexOf('DAGGER') !== 0) {
      this.name = 'DAGGER ' + this.name;
    }
  }

  qubitsUsed () {
    return this.qubits;
  }

  code (language: string) {
    if (language === 'quil') {
      return `${this.name} ${this.qubits.join(' ')}`;
    } else if (language === 'q#') {
      if (this.name.indexOf('DAGGER') === 0) {
        throw new Error('Dagger of gates not supported for Q#');
      }
      return `${this.name}(${this.qubits.join(' ')});`;
    } else if (language === 'qasm') {
      return `${this.qasmVersion(this.name)} q[${this.qubits.join(' ')}];`;
    }
    return '';
  }
}
