# Quantum-Quail

Work in progress - rewrite of jsQuil quantum computer programming library

<img src="https://raw.githubusercontent.com/mapmeld/quantum-quail/master/quail-logo.png" width="300"/>

Goals:
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
