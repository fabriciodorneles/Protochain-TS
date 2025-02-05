import Block from './block'
import BlockInfo from './blockInfo'
import Transaction from './transaction'
import { TransactionType } from './transactionType'
import Validation from './validation'

/**
 * Blockchain class
 */
export default class Blockchain {
  blocks: Block[]
  nextIndex: number = 0
  static readonly DIFFICULTY_FACTOR: number = 5
  static readonly MAX_DIFFICULTY: number = 62

  /**
   * Create a new blockchain with genesis block
   */
  constructor() {
    this.blocks = [
      new Block({
        index: this.nextIndex,
        hash: '',
        transactions: [
          new Transaction({
            type: TransactionType.FEE,
            data: new Date().toString(),
          } as Transaction),
        ],
      } as Block),
    ]
    this.nextIndex++
  }

  getLastBlock(): Block {
    return this.blocks[this.blocks.length - 1]
  }

  getDifficulty(): number {
    return Math.ceil(this.blocks.length / Blockchain.DIFFICULTY_FACTOR)
  }

  addBlock(block: Block): Validation {
    const lastBlock = this.getLastBlock()
    const validation = block.isValid(
      lastBlock.hash,
      lastBlock.index,
      this.getDifficulty(),
    )
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
        this.getDifficulty(),
      )
      if (!validation.success)
        return new Validation(
          false,
          `Block #${i} is invalid: ${validation.message}`,
        )
    }
    return new Validation(true, 'Blockchain is valid')
  }

  getFeePerTx(): number {
    return 1
  }

  getNextBlock(): BlockInfo {
    const transactions = [{ data: new Date().toString() }]
    const difficulty = this.getDifficulty()
    const previousHash = this.getLastBlock().hash
    const index = this.blocks.length
    const feePerTx = this.getFeePerTx()
    const maxDifficulty = Blockchain.MAX_DIFFICULTY

    return {
      index,
      previousHash,
      difficulty,
      feePerTx,
      transactions,
      maxDifficulty,
    } as BlockInfo
  }
}
