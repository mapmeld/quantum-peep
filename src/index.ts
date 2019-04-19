export { Gates } from './gates';
export { Program } from './programs';
export { RigettiProcessor, IBMProcessor } from './processors';

/* use these as shorthand for radians: pi/4, 0.28pi, etc. */
let pi_multiplied_by = (n: number) => {
  return {
    number: n,
    action: 'multiply'
  };
};

let pi_divided_by = (n: number) => {
  return {
    number: n,
    action: 'divide'
  };
};
export { pi_multiplied_by, pi_divided_by };
