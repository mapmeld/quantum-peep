
class BasicGate {
  name: string;
  qubits: Array<number>;
  static validGates: Array<string> = ['X', 'Y', 'Z', 'H', 'S', 'T', 'DAGGER S', 'DAGGER T', 'I'];

  constructor (name: string, qubits: Array<number>) {
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

  code (language: string) {
    if (language === 'quil') {
      return `${this.name} ${this.qubits.join(' ')}`;
    } else if (language === 'q#') {
      return `${this.name}(${this.qubits.join(' ')});`;
    } else if (language === 'qasm') {
      return `${this.qasmVersion(this.name)} q[${this.qubits.join(' ')}];`;
    }
  }
}

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
  }

  // CX: (qa: number, qb: number) => {
  //   return new BasicGate('CX', [qa, qb]);
  // }
};
