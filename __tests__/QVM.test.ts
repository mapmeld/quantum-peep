import { Gates, Program, RigettiProcessor, IBMProcessor } from '../src';

// Travis / prod ENV vars for secrets
let secrets = {
  rigetti: {
    api_key: process.env.RIGETTI_API_KEY,
    user_id: process.env.RIGETTI_USER_ID
  },
  ibm: {
    login: process.env.IBM_LOGIN,
    token: process.env.IBM_TOKEN
  }
};
try {
  // local file copy of secrets
  secrets = require('./secrets.json');
} catch (e) { }

test('blank test', (done) => {
  // dont run quantum chips all the time
  done();
});

test('device list from Rigetti', (done) => {
  let q = new RigettiProcessor({
    api_key: secrets.rigetti.api_key || '',
    user_id: secrets.rigetti.user_id || ''
  });

  q.devices((devices: object) => {
    console.log(devices);
    expect(Object.keys(devices).length).toBeGreaterThan(0);
    expect(devices).toHaveProperty('Aspen-4');
    done();
  });
});

// test('one gate then measure program sent to Rigetti QVM (Docker)', (done) => {
//   let xgate = Gates.X(1);
//   let p = new Program();
//   p.add(xgate);
//   p.measure(1, 2);

//   let q = new RigettiProcessor({
//     //api_key: secrets.rigetti.api_key || '',
//     //user_id: secrets.rigetti.user_id || ''
//     endpoint: 'http://167.99.232.33:5000'
//   });
//   q.run(p, 2, (body: object) => {
//     console.log(body);
//     done();
//   });
// }, 10000);

test('one gate then measure program sent to IBM', (done) => {
  let xgate = Gates.X(1);
  let p = new Program();
  p.add(xgate);
  p.measure(1, 2);

  let q = new IBMProcessor({
      login: secrets.ibm.login,
      processor: 'ibmq_qasm_simulator'
    });
  q.run(p, 2, (body: object) => {
    console.log(body);
    done();
  });
}, 10000);

test('device list from IBM', (done) => {
  let q = new IBMProcessor({
    token: secrets.ibm.token
  });

  q.devices((devices: Array<{name: string}>) => {
    console.log(devices);
    expect(devices[0].name).toBe('ibmq_qasm_simulator');
    done();
  });
});
