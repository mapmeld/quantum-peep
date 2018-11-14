export const Gates = {
  X: (qubit: number) => {
    return {
      code: (language: string) => {
        if (language === 'quil') {
          return `X ${qubit}`;
        } else if (language === 'qasm') {
          return `x q[${qubit}];`;
        }
      }
    };
  }
};
