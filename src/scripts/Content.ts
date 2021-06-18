export default class Content {
  constructor(private readonly message: string) {}

  get data() {
    return this.message;
  }
}
