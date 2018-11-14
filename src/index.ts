
class BasicGate {
  name: string;
  qubit: number;
  static validGates: Array<string> = ['X'];

  constructor (name: string, qubit: number) {
    if (BasicGate.validGates.indexOf(name.toUpperCase()) === -1) {
      throw new Error('Gate type unknown');
    }
    this.name = name;
    this.qubit = qubit;
  }

  code (language: string) {
    if (language === 'quil') {
      return `${this.name.toUpperCase()} ${this.qubit}`;
    } else if (language === 'q#') {
      return `${this.name.toUpperCase()}(${this.qubit});`;
    } else if (language === 'qasm') {
      return `${this.name.toLowerCase()} q[${this.qubit}];`;
    }
  }
}

export const Gates = {
  X: (qubit: number) => {
    return new BasicGate('X', qubit);
  }
};
