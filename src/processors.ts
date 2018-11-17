export class QProcessor {
  provider: string;
  connection: object;

  constructor (provider: string, connectionDetails: object) {
    this.provider = provider;
    this.connection = connectionDetails;
  }
}
