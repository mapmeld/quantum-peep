
class ProgramStep {
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

class Measure extends ProgramStep {
  qubit: number;
  register: number;

  constructor (qubit: number, register: number) {
    super();
    this.qubit = qubit;
    this.register = register;
  }

  qubitsUsed () {
    return [this.qubit];
  }

  registersUsed () {
    return [this.register];
  }

  code (language: string) {
    switch (language) {
      case 'quil':
        return `MEASURE ${this.qubit} ro[${this.register}]`;
      case 'q#':
        return `let reg${this.register} = M(${this.qubit});`;
      case 'qasm':
        return `measure q[${this.qubit}] -> c[${this.register}];`;
      default:
        return '';
    }
  }
}

class BasicGate extends ProgramStep {
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

export class Program {
  actions: Array<ProgramStep>;

  constructor () {
    this.actions = [];
  }

  add (gate: BasicGate) {
    this.actions.push(gate);
  }

  qubitsUsed () {
    let qbs : Array<number> = [];
    this.actions.forEach((action) => {
      qbs = qbs.concat(action.qubitsUsed());
    });
    return qbs.filter((v: number, i: number) => qbs.indexOf(v) === i).sort();
  }

  registersUsed () {
    let rgs : Array<number> = [];
    this.actions.forEach((action) => {
      rgs = rgs.concat(action.registersUsed());
    });
    return rgs.filter((v: number, i: number) => rgs.indexOf(v) === i).sort();
  }

  code (language: string) {
    let start = '',
        end = '';

    // works until we embed programs
    switch (language) {
      // AFAIK quil does not have this type of prefix/suffix
      case 'q#':
        // something like https://docs.microsoft.com/en-us/quantum/quickstart?view=qsharp-preview&tabs=tabid-vs2017
        break;
      case 'qasm':
        start = 'OPENQASM 2.0;include "qelib1.inc";';
        start += this.qubitsUsed().map((qubit: number) => { return `qreg q[${qubit}];` });
        start += this.registersUsed().map((register: number) => { return `creg c[${register}];` });
        start += '\n';
        break;
    }

    let body = this.actions.map((action) => {
      return action.code(language);
    }).join('\n');
    return start + body + end;
  }

  measure (qubit: number, register: number) {
    this.actions.push(new Measure(qubit, register));
  }
}

export class QProcessor {
  provider: string;
  connection: object;

  constructor (provider: string, connectionDetails: object) {
    this.provider = provider;
    this.connection = connectionDetails;
  }
}
