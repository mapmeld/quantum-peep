# Quantum-Peep

[![Greenkeeper badge](https://badges.greenkeeper.io/mapmeld/quantum-peep.svg)](https://greenkeeper.io/)

Work in progress - build quantum programs that are platform-agnostic -
compile for IBM's QASM, Rigetti's Quil, Microsoft's Q#, or Google's Cirq.

<img src="https://raw.githubusercontent.com/mapmeld/quantum-peep/master/quail-logo.png" width="300"/>

## Example code

```javascript
import { Gates, Program, RigettiProcessor, IBMProcessor } from 'quantum-peep';

// write your quantum gates and measurements into a program
let p = new Program();
p.add(Gates.X(1));
p.measure(1, 2);

// get Microsoft's Q# code
p.code('q#');

// get Python code for Google Cirq
p.code('cirq');

// run on Rigetti QVM Docker container
// You can use my server here (does not receive API key or User ID credentials)
// For actual QPUs, register for Rigetti Forest and use their endpoint, api_key, and user_id
let q = new RigettiProcessor({
  endpoint: 'http://165.227.62.245:5000',
  api_key: 'aaa',
  user_id: 'uuu'
});
let runTimes = 10;
q.run(p, runTimes, (body) => {
  console.log(JSON.parse(body));
});

// fetch device options + status from https://forest-server.qcs.rigetti.com/devices
q.devices((deviceInfo) => {
  // { "Aspen-4": { "is_online": false, ... }, "Aspen-3": { ... } }
});

// run on IBM quantum chip
let q2 = new IBMProcessor({
  login: secrets.ibm.token,
  processor: 'ibmqx4'
});
// fetch device options + status from https://quantumexperience.ng.bluemix.net/api/Backends/ibmqx4
// uses given processor type
q2.devices((deviceInfo) => {
  // { "id": "ibmqx4", "status": "on", ... }
});
q2.run(p, runTimes, (body) => {
  console.log(JSON.parse(body));
});
```

### More complex gates

```javascript
// gate names from different platforms are equivalent
Gates.CNOT(control, target);
Gates.CX(control, target);

// swap operations
Gates.SWAP(qubit1, qubit2);
Gates.CSWAP(conditional, qubit1, qubit2);
// ISWAP and PSWAP are only one-step operations in Quil? Advice welcome

// phase gates: phase is a radian value
// use this shorthand to express on several different platforms

import { pi_multipled_by, pi_divided_by } from 'quantum-peep';
Gates.RX(pi_multiplied_by(0.45), qubit1);
Gates.RY(pi_divided_by(2), qubit2);
```

### Bonus features

Output a circuit diagram with this library ported from QISKit Python: https://github.com/mapmeld/quantum-circuit-viz

```javascript
import { textViz } from 'quantum-circuit-viz';
...
program.add(Gates.X(1));
program.measure(1, 2);
textViz(program);
```

```
        ┌───┐┌─┐
q_1: |0>┤ X ├┤M├
        └───┘└╥┘
 c_2: 0 ══════╩═
```

## Goals

- work with experimental results from APIs
- more complex conditional / GOTO output in assembly languages
- async/queue support: for newer APIs which put programs in a queue
- browser JS distribution: easier use in web apps

## Language references

IBM's QISkit (for Python and JS) compile to OpenQASM:
https://github.com/Qiskit/openqasm and Cloud reference: https://github.com/Qiskit/qiskit-js/tree/master/packages/qiskit-cloud

Rigetti's pyQuil (and the previous jsQuil project) compile to Quil:
http://docs.rigetti.com/en/stable/compiler.html

Microsoft Q#
https://docs.microsoft.com/en-us/quantum/language/?view=qsharp-preview

Google Cirq
https://github.com/quantumlib/Cirq

## License

Open source, MIT license
