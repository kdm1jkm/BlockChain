import Block from "./Block";
import Content from "./Content";

export default class BlockChain {
  private readonly blocks: Array<Block> = new Array<Block>(this.genesisBlock);

  constructor(
    private readonly genesisBlock: Block = new Block(
      "",
      new Content("Genesis Block")
    ),
    public difficulty: number = 0
  ) {}

  public checkLastHashValid(): boolean {
    return this.lastBlock.hash.startsWith("0".repeat(this.difficulty));
  }

  public addBlock(
    content: Content = new Content(`new Block #${this.blocks.length}`)
  ): boolean {
    if (!this.checkLastHashValid()) return false;

    this.blocks.push(new Block(this.lastBlock.hash, content));

    return true;
  }

  public get lastBlock() {
    return this.blocks[this.blocks.length - 1];
  }

  public findHash(callEveryLoop?: (block: Block) => void) {
    while (!this.checkLastHashValid()) {
      this.lastBlock.nonce++;
      callEveryLoop(this.lastBlock);
    }
  }
}
