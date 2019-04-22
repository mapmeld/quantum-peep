
import { Program } from './programs';

const fetch = require('node-fetch');
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

  run (program: Program, iterations: number, callback: (body: object) => void) {
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

  run (program: Program, iterations: number, callback: (body: object) => void) {
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

    fetch(this.endpoint, {
      method: 'post',
      headers: relevantHeaders,
      body: JSON.stringify(payload)
    })
    .then((res: { json: () => {} }) => res.json())
    .then((body: object) => {
      callback(body);
    });
  }

  devices (callback: (devices: object) => void) {
    fetch(this.endpoint + '/devices', {
      headers: {
        'X-Api-Key': this.connection.api_key,
        'X-User-Id': this.connection.user_id,
        'Accept': 'application/octet-stream'
      }
    }).then((res: { json: () => {} }) => res.json())
    .then((jsresponse: { devices: object }) => {
      callback(jsresponse.devices || {});
    });
  }
}

export class IBMProcessor extends QProcessor {
  constructor ({ endpoint='', api_key='', user_id='', login='', processor='simulator' } : { endpoint?: string, api_key?: string, user_id?: string, login?: string, processor?: string }) {
    super(arguments[0] || {});
  }

  run (program: Program, iterations: number, callback: (body: object) => void) {
    const cloud = new Cloud();
    cloud.login(this.connection.login).then(() => {
      cloud.backends().then((res: object) => {
        cloud.run(program.code('qasm'), {
            backend: this.connection.processor,
            shots: iterations
          })
          .then((res2: object) => {
            callback(res2);
          });
      });
    });
  }

  devices (callback: (device: { id: string, status: string }) => void) {
    if (!this.connection.processor || this.connection.processor === 'simulator') {
      return {};
    }
    fetch(`https://quantumexperience.ng.bluemix.net/api/Backends/${this.connection.processor}`)
      .then((res: { json: () => {} }) => res.json())
      .then((jsresponse: {id: string, status: string}) => {
        callback(jsresponse || { id: '', status: '' });
      });
  }
}
