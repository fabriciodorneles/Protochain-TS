import Validation from '../validation'

/**
 * Mocked Block class
 */
export default class Block {
  index: number
  timestamp: number
  hash: string
  previousHash: string
  data: string

  /**
   * Creates a new mock block
   * @param block the block data
   */
  constructor(block?: Block) {
    this.index = block?.index || 0
    this.timestamp = block?.timestamp || Date.now()
    this.previousHash = block?.previousHash || ''
    this.data = block?.data || ''
    this.hash = block?.hash || this.getHash()
  }

  getHash(): string {
    return this.hash || 'abc'
  }

  /**
   * Validate the mock block
   * @returns true if the block is valid
   */
  isValid(previousHash: string, previousIndex: number): Validation {
    if (!previousHash || previousIndex < 0 || this.index < 0)
      return new Validation(false, 'Invalid mock block')

    return new Validation(true, 'Block is valid')
  }
}
