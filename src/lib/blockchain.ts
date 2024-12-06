import Block from './block'

/**
 * Blockchain class
 */
export default class Blockchain {
  blocks: Block[]

  /**
   * Create a new blockchain with genesis block
   */
  constructor() {
    this.blocks = [new Block(0, '', 'Genesis block')]
  }

  addBlock(block: Block) {
    this.blocks.push(block)
  }

  isValid(): boolean {
    for (let i = 0; i < this.blocks.length; i++) {
      if (i !== this.blocks[i].index) return false
      if (i > 0 && this.blocks[i - 1].hash !== this.blocks[i].hash) return false
    }
    return true
  }
}
