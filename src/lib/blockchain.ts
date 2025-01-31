import Block from './block'
import Validation from './validation'

/**
 * Blockchain class
 */
export default class Blockchain {
  blocks: Block[]
  nextIndex: number = 0

  /**
   * Create a new blockchain with genesis block
   */
  constructor() {
    this.blocks = [
      new Block({
        index: this.nextIndex,
        hash: '',
        data: 'Genesis block',
      } as Block),
    ]
    this.nextIndex++
  }

  getLastBlock(): Block {
    return this.blocks[this.blocks.length - 1]
  }

  addBlock(block: Block): Validation {
    const lastBlock = this.getLastBlock()
    const validation = block.isValid(lastBlock.hash, lastBlock.index)
    if (!validation.success)
      return new Validation(false, `Block is invalid: ${validation.message}`)
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
    for (let i = this.blocks.length - 1; i > 0; i--) {
      const currentBlock = this.blocks[i]
      const previousBlock = this.blocks[i - 1]
      const validation = currentBlock.isValid(
        previousBlock.hash,
        previousBlock.index,
      )
      if (!validation.success)
        return new Validation(
          false,
          `Block #${i} is invalid: ${validation.message}`,
        )
    }
    return new Validation(true, 'Blockchain is valid')
  }
}
