import Block from './block'
import Validation from '../validation'

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
}
