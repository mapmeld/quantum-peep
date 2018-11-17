# Quantum-Quail

[![Greenkeeper badge](https://badges.greenkeeper.io/mapmeld/quantum-quail.svg)](https://greenkeeper.io/)

Work in progress - rewrite of jsQuil quantum computer programming library

<img src="https://raw.githubusercontent.com/mapmeld/quantum-quail/master/quail-logo.png" width="300"/>

## Example code

```javascript
import { Gates, Program, QProcessor } from 'quantum-quail';

// write your quantum gates and measurements into a program
let p = new Program();
p.add(Gates.X(1));
p.measure(1, 2);

// get Microsoft's Q# code
p.code('q#');

// run on Rigetti QVM
let q = new QProcessor('rigetti', { api_key: 'aaa', user_id: 'uuu' });
let runTimes = 1;
q.run(p, runTimes, (body) => {
  console.log(JSON.parse(body));
});

// run on IBM quantum chip (ibmqx4)
let q2 = new QProcessor('ibm', {
  login: secrets.ibm.token
});
// runTimes is not yet used here
q2.run(p, runTimes, (body) => {
  console.log(JSON.parse(body));
});
```

## Goals

- platform-agnostic: Rigetti, IBM, and potentially more providers
- async/queue support: for newer APIs which put programs in a queue
- TypeScript: for more structure and my own benefit
- browser JS distribution: for use in web apps

## Language references

IBM's QISkit (for Python and JS) compile to OpenQASM:
https://github.com/Qiskit/openqasm

Rigetti's pyQuil (and the previous jsQuil project) compile to Quil:
http://docs.rigetti.com/en/stable/compiler.html

Microsoft Q#
https://docs.microsoft.com/en-us/quantum/language/?view=qsharp-preview

## License

Open source, MIT license
