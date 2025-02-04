import sha256 from 'crypto-js/sha256'
import Validation from './validation'
import BlockInfo from './blockInfo'

/**
 * Block class
 */
export default class Block {
  index: number
  timestamp: number
  previousHash: string
  data: string
  nonce: number
  miner: string
  hash: string

  /**
   * Creates a new block
   * @param block the block data
   */
  constructor(block?: Block) {
    this.index = block?.index || 0
    this.timestamp = block?.timestamp || Date.now()
    this.previousHash = block?.previousHash || ''
    this.data = block?.data || ''
    this.nonce = block?.nonce || 0
    this.miner = block?.miner || ''
    this.hash = block?.hash || this.getHash()
  }

  getHash(): string {
    return sha256(
      this.index +
        this.timestamp +
        this.previousHash +
        this.data +
        this.nonce +
        this.miner,
    ).toString()
  }

  /**
   * Generates a new valid hash for this block with the specified difficulty
   * @param difficulty the blockchain current difficulty
   * @param miner the miner wallet address
   */
  mine(difficulty: number, miner: string): void {
    this.miner = miner
    const prefix = new Array(difficulty + 1).join('0')
    do {
      this.nonce++
      this.hash = this.getHash()
    } while (!this.hash.startsWith(prefix))
  }

  /**
   * Validate the block
   * @returns true if the block is valid
   */
  isValid(
    previousHash: string,
    previousIndex: number,
    difficulty: number,
  ): Validation {
    if (this.index !== previousIndex + 1)
      return new Validation(false, 'Invalid index')
    if (!this.data) return new Validation(false, 'Invalid data')
    if (this.previousHash !== previousHash)
      return new Validation(false, 'Invalid previous hash')
    if (this.timestamp < 1) return new Validation(false, 'Invalid timestamp')
    if (!this.nonce || !this.miner)
      return new Validation(false, 'Invalid nonce or miner')

    const prefix = new Array(difficulty + 1).join('0')
    if (this.hash !== this.getHash() || !this.hash.startsWith(prefix))
      return new Validation(false, 'Invalid hash')

    return new Validation(true, 'Block is valid')
  }

  static fromBlockInfo(blockInfo: BlockInfo): Block {
    const block = new Block()
    block.index = blockInfo.index
    block.previousHash = blockInfo.previousHash
    block.data = blockInfo.data

    return block
  }
}
