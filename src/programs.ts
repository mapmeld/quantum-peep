import { ProgramStep } from './programstep';
import { BasicGate } from './basicgate';

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
      case 'qobj':
        return `{"name":"measure","qubits":[${this.qubit}],"clbits":[${this.register}]}`;
      case 'cirq':
        return `cirq.measure(q_${this.qubit}, key='c_${this.register}')`;
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
      case 'quil':
        let regmax = -1;
        this.registersUsed().forEach((reg) => {
          regmax = Math.max(reg + 1, regmax);
        });
        if (regmax > -1) {
          start = `DECLARE ro BIT[${regmax}]\n`;
        }
        break;
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
      case 'qobj':
        start = '{"id":"test_qobj","config":{"shots":1,"seed":1},"experiments":[';
        start += '{"header":{"number_of_clbits":' + this.registersUsed();
        start += ',"number_of_qubits":' + this.qubitsUsed() + '},"instructions":[';
        end += ']}]}';
        break;
      case 'cirq':
        start = 'import cirq\n';
        this.qubitsUsed().forEach((q) => {
          start += `q_${q} = cirq.GridQubit(0, ${q})\n`;
        });
        start += 'circuit = cirq.Circuit.from_ops(\n';
        end = ')\n';
        break;
    }

    let joiner = '\n';
    if (language === 'qasm') {
      joiner = '';
    } else if (language === 'cirq' || language === 'qobj') {
      joiner = ',\n';
    }

    let body = this.actions.map((action) => {
      return action.code(language);
    }).join(joiner);
    return start + body + end;
  }

  measure (qubit: number, register: number) {
    this.actions.push(new Measure(qubit, register));
  }
}
