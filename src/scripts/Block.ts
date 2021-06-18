import Content from "./Content";
import CryptoJS from "crypto-js";

export default class Block {
  private _nonce: number = 0;
  private _hash: string;

  constructor(public readonly prevHash: string, private _content: Content) {
    this.computeHash();
  }

  private computeHash() {
    this._hash = CryptoJS.SHA256(
      this.prevHash + this._content.data + this.nonce.toString()
    ).toString();
  }

  get content() {
    return this._content;
  }

  set content(value) {
    this._content = value;
    this.computeHash();
  }

  set nonce(value: number) {
    this._nonce = value;
    this.computeHash();
  }

  get nonce() {
    return this._nonce;
  }

  get hash() {
    return this._hash;
  }
}
