import { Gates } from '../src/gates';
import { Program } from '../src/programs';
import { QProcessor } from '../src/processors';

// Travis / prod ENV vars for secrets
let secrets = {
  rigetti: {
    api_key: process.env.RIGETTI_API_KEY,
    user_id: process.env.RIGETTI_USER_ID
  },
  ibm: {
    login: process.env.IBM_LOGIN
  }
};
try {
  // local file copy of secrets
  secrets = require('./secrets.json');
} catch (e) { }

test('one gate then measure program sent to Rigetti', (done) => {
  let xgate = Gates.X(1);
  let p = new Program();
  p.add(xgate);
  p.measure(1, 2);

  let q = new QProcessor('rigetti', {
    api_key: secrets.rigetti.api_key || '',
    user_id: secrets.rigetti.user_id || ''
  });
  q.run(p, 1, (body: string) => {
    console.log(body);
    done();
  });
}, 10000);

test('one gate then measure program sent to IBM', (done) => {
  let xgate = Gates.X(1);
  let p = new Program();
  p.add(xgate);
  p.measure(1, 2);

  let q = new QProcessor('ibm', { login: secrets.ibm.login });
  q.run(p, 1, (body: string) => {
    console.log(body);
    done();
  });
}, 10000);
