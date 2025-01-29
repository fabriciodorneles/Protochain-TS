import sha256 from 'crypto-js/sha256'
import Validation from './validation'

/**
 * Block class
 */
export default class Block {
  index: number
  timestamp: number
  hash: string
  previousHash: string
  data: string

  /**
   * Creates a new block
   * @param index The block index in the blockchain
   * @param hash The block hash
   * @param previousHash The previous block hash
   * @param data The block data
   */
  constructor(index: number, previousHash: string, data: string) {
    this.index = index
    this.timestamp = Date.now()
    this.previousHash = previousHash
    this.data = data
    this.hash = this.getHash()
  }

  getHash(): string {
    return sha256(
      this.index + this.timestamp + this.previousHash + this.data,
    ).toString()
  }

  /**
   * Validate the block
   * @returns true if the block is valid
   */
  isValid(previousHash: string, previousIndex: number): Validation {
    if (this.index !== previousIndex + 1)
      return new Validation(false, 'Invalid index')
    if (!this.data) return new Validation(false, 'Invalid data')
    if (this.previousHash !== previousHash)
      return new Validation(false, 'Invalid previous hash')
    if (this.timestamp < 1) return new Validation(false, 'Invalid timestamp')
    if (this.hash !== this.getHash())
      return new Validation(false, 'Invalid hash')
    return new Validation(true, 'Block is valid')
  }
}
