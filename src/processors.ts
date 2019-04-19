
import { Program } from './programs';

const request = require('request');
const Cloud = require('@qiskit/cloud');

class QProcessor {
  connection: {
    api_key: string,
    user_id: string,
    login: string,
    processor: string
  };

  constructor ({ endpoint='', api_key='', user_id='', login='', processor='simulator' } : { endpoint?: string, api_key?: string, user_id?: string, login?: string, processor?: string }) {
    this.connection = { api_key, user_id, login, processor };
  }

  run (program: Program, iterations: number, callback: (body: string) => void) {
  }

  devices (callback: (devices: object) => void) {
  }
}

export class RigettiProcessor extends QProcessor {
  endpoint: string;

  constructor ({ endpoint='', api_key='', user_id='', login='', processor='simulator' } : { endpoint?: string, api_key?: string, user_id?: string, login?: string, processor?: string }) {
    super(arguments[0] || {});
    this.endpoint = endpoint || 'https://forest-server.qcs.rigetti.com';
  }

  run (program: Program, iterations: number, callback: (body: string) => void) {
    let payload = {
      type: 'multishot-measure',
      qubits: program.qubitsUsed(),
      trials: iterations,
      'compiled-quil': program.code('quil')
    };
    // if (this.gate_noise) {
    //   payload['gate-noise'] = this.gate_noise;
    // }
    // if (this.measure_noise) {
    //   payload['measurement-noise'] = this.measure_noise;
    // }

    let relevantHeaders = {
      'Content-Type': 'application/json; charset=utf-8',
      'Accept': 'application/octet-stream',
      'X-Api-Key': '',
      'X-User-Id': ''
    };
    if (this.connection.processor !== 'simulator') {
      // only send credentials to QPU endpoints, not my QVM docker
      relevantHeaders['X-Api-Key'] = this.connection.api_key;
      relevantHeaders['X-User-Id'] = this.connection.user_id;
    }

    request.post({
      url: this.endpoint,
      headers: relevantHeaders,
      json: payload
    }, (err: object, response: object, body: string) => {
      callback(body);
    });
  }

  devices (callback: (devices: object) => void) {
    request.get({
      url: this.endpoint + '/devices',
      headers: {
        'X-Api-Key': this.connection.api_key,
        'X-User-Id': this.connection.user_id,
        'Accept': 'application/octet-stream'
      }
    }, (err: object, response: object, body: string) => {
      let jsresponse = JSON.parse(body);
      callback(jsresponse.devices || {});
    });
  }
}

export class IBMProcessor extends QProcessor {
  constructor ({ endpoint='', api_key='', user_id='', login='', processor='simulator' } : { endpoint?: string, api_key?: string, user_id?: string, login?: string, processor?: string }) {
    super(arguments[0] || {});
  }

  run (program: Program, iterations: number, callback: (body: string) => void) {
    const cloud = new Cloud();
    cloud.login(this.connection.login).then(() => {
      cloud.backends().then((res: object) => {
        console.log(res);

        cloud.run(program.code('qasm'), {
            backend: this.connection.processor,
            shots: iterations
          })
          .then((res2: object) => {
            callback(JSON.stringify(res2));
          });
      });
    });
  }

  devices (callback: (device: { id: string, status: string }) => void) {
    if (!this.connection.processor || this.connection.processor === 'simulator') {
      return {};
    }
    request.get(`https://quantumexperience.ng.bluemix.net/api/Backends/${this.connection.processor}`, (err: object, response: object, body: string) => {
      let jsresponse = JSON.parse(body);
      callback(jsresponse || {});
    });
  }
}
