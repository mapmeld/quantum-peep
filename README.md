# Quantum-Quail

Work in progress - rewrite of jsQuil

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

## License

Open source, MIT license
