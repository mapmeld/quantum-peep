
import { Program } from './programs';

const request = require('request');
const Cloud = require('@qiskit/cloud');

export class QProcessor {
  provider: string;
  connection: { endpoint: string, api_key: string, user_id: string, login: string };

  constructor (provider: string, { endpoint='', api_key='', user_id='', login='' } : { endpoint?: string, api_key?: string, user_id?: string, login?: string }) {
    this.provider = provider;
    if (provider === 'rigetti') {
      endpoint = endpoint || 'https://api.rigetti.com/qvm';
    }
    this.connection = { endpoint, api_key, user_id, login };
  }

  run (program: Program, iterations: number, callback: (body: string) => void) {
    if (this.provider === 'rigetti') {
      this.runRigetti(program, iterations, callback);
    } else if (this.provider === 'ibm') {
      this.runIBM(program, iterations, callback);
    }
  }

  runRigetti (program: Program, iterations: number, callback: (body: string) => void) {
    let payload = {
      type: 'multishot',
      addresses: program.registersUsed(),
      trials: iterations,
      'quil-instructions': program.code('quil')
    };
    // if (this.gate_noise) {
    //   payload['gate-noise'] = this.gate_noise;
    // }
    // if (this.measure_noise) {
    //   payload['measurement-noise'] = this.measure_noise;
    // }

    request.post({
      url: this.connection.endpoint,
      headers: {
        'X-Api-Key': this.connection.api_key,
        'X-User-Id': this.connection.user_id,
        'Content-Type': 'application/json; charset=utf-8',
        'Accept': 'application/octet-stream'
      },
      json: payload
    }, (err: object, response: object, body: string) => {
      callback(body);
    });
  }

  runIBM (program: Program, iterations: number, callback: (body: string) => void) {
    const cloud = new Cloud();
    cloud.login(this.connection.login).then(() => {
      cloud.backends().then((res: object) => {
        console.log(res);

        cloud.run(program.code('qasm'), {
            backend: 'ibmqx4',
            shots: iterations            
          })
          .then((res2: object) => {
            callback(JSON.stringify(res2));
          });
      });
    });
  }
}
