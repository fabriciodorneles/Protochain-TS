import Block from './block'
import Validation from '../validation'
import BlockInfo from '../blockInfo'

/**
 *  Mocked Blockchain class
 */
export default class Blockchain {
  blocks: Block[]
  nextIndex: number = 0

  /**
   * Create a new mocked blockchain with genesis block
   */
  constructor() {
    this.blocks = [
      new Block({
        index: this.nextIndex,
        hash: 'abc',
        data: 'Genesis block',
        timestamp: Date.now(),
      } as Block),
    ]
    this.nextIndex++
  }

  getLastBlock(): Block {
    return this.blocks[this.blocks.length - 1]
  }

  addBlock(block: Block): Validation {
    if (block.index < 0) return new Validation(false, 'Invalid mock block')
    this.blocks.push(block)
    this.nextIndex++
    return new Validation(true, 'Block added successfully')
  }

  getBlock(parameter: number | string | undefined): Block | undefined {
    return this.blocks.find(
      (block) => block.index === Number(parameter) || block.hash === parameter,
    )
  }

  isValid(): Validation {
    return new Validation(true, 'Blockchain is valid')
  }

  getFeePerTx(): number {
    return 1
  }

  getNextBlock(): BlockInfo {
    const data = new Date().toString()
    const difficulty = 0
    const previousHash = this.getLastBlock().hash
    const index = 1
    const feePerTx = this.getFeePerTx()
    const maxDifficulty = 62

    return {
      index,
      previousHash,
      difficulty,
      feePerTx,
      data,
      maxDifficulty,
    } as BlockInfo
  }
}
