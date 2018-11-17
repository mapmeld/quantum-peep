import { BasicGate, ProgramStep } from './index';

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
        return `MEASURE ${this.qubit} [${this.register}]`;
      case 'q#':
        return `let reg${this.register} = M(${this.qubit});`;
      case 'qasm':
        return `measure q[${this.qubit}] -> c[${this.register}];`;
      default:
        return '';
    }
  }
}

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
        let qbs = this.qubitsUsed();
        start += `qreg q[${qbs[qbs.length - 1] + 1}];`
        let rgs = this.registersUsed();
        start += `creg c[${rgs[rgs.length - 1] + 1}];`        
        break;
    }

    let body = this.actions.map((action) => {
      return action.code(language);
    }).join(language === 'qasm' ? '' : '\n');
    return start + body + end;
  }

  measure (qubit: number, register: number) {
    this.actions.push(new Measure(qubit, register));
  }
}
