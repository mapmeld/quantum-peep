import { Gates } from '../src/gates';
import { Program } from '../src/programs';
import { QProcessor } from '../src/processors';

let secrets = {
  api_key: process.env.API_KEY,
  user_id: process.env.USER_ID
};
try {
  secrets = require('./secrets.json');
} catch (e) { }

test('one gate then measure program sent to Rigetti', (done) => {
  let xgate = Gates.X(1);
  let p = new Program();
  p.add(xgate);
  p.measure(1, 2);

  let q = new QProcessor('rigetti', {
    api_key: secrets.api_key || '',
    user_id: secrets.user_id || ''
  });
  q.run(p, 1, (body: string) => {
    console.log(body);
    done();
  });
});
