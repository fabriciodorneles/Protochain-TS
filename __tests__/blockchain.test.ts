import Blockhain from '../src/lib/blockchain'
import Block from '../src/lib/block'
import Transaction from '../src/lib/transaction'
import { TransactionType } from '../src/lib/transactionType'

jest.mock('../src/lib/block')
jest.mock('../src/lib/transaction')

describe('Blockchain', () => {
  it('Should has genesis block', () => {
    const blockchain = new Blockhain()
    expect(blockchain.blocks.length).toBe(1)
  })

  it('should be valid', () => {
    const blockchain = new Blockhain()
    expect(blockchain.isValid().success).toBe(true)
  })

  it('should add a new block', () => {
    const blockchain = new Blockhain()
    const result = blockchain.addBlock(
      new Block({
        index: 1,
        previousHash: blockchain.blocks[0].hash,
        transactions: [
          new Transaction({
            type: TransactionType.FEE,
            data: 'test data',
          } as Transaction),
        ],
      } as Block),
    )
    expect(result.success).toBe(true)
    expect(blockchain.blocks.length).toBe(2)
  })

  it('should not add block if new block is invalid', () => {
    const blockchain = new Blockhain()
    const result = blockchain.addBlock(
      new Block({
        index: -1,
        previousHash: blockchain.blocks[0].hash,
        transactions: [
          new Transaction({
            type: TransactionType.FEE,
            data: 'test data',
          } as Transaction),
        ],
      } as Block),
    )
    expect(result.success).toBe(false)
    expect(blockchain.blocks.length).toBe(1)
  })

  it('should be valid with two blocks', () => {
    const blockchain = new Blockhain()
    blockchain.addBlock(
      new Block({
        index: 1,
        previousHash: blockchain.blocks[0].hash,
        transactions: [
          new Transaction({
            type: TransactionType.FEE,
            data: 'test data',
          } as Transaction),
        ],
      } as Block),
    )
    expect(blockchain.isValid().success).toBe(true)
  })

  it('should not be valid if block is changed', () => {
    const blockchain = new Blockhain()
    blockchain.addBlock(
      new Block({
        index: 1,
        previousHash: blockchain.blocks[0].hash,
        transactions: [
          new Transaction({
            type: TransactionType.FEE,
            data: 'test data',
          } as Transaction),
        ],
      } as Block),
    )
    blockchain.blocks[1].index = -1
    expect(blockchain.isValid().success).toBe(false)
  })

  it('should get the block by index', () => {
    const blockchain = new Blockhain()
    blockchain.addBlock(
      new Block({
        index: 1,
        previousHash: blockchain.blocks[0].hash,
        transactions: [
          new Transaction({
            type: TransactionType.FEE,
            data: 'test data',
          } as Transaction),
        ],
      } as Block),
    )
    const block = blockchain.getBlock(1)
    expect(block).toBeDefined()
    expect(block?.index).toBe(1)
    expect(block?.transactions).toEqual([
      expect.objectContaining({
        data: 'test data',
        type: TransactionType.FEE,
      }),
    ])
  })

  it('should get the block by hash', () => {
    const blockchain = new Blockhain()
    const newBlock = new Block({
      index: 1,
      previousHash: blockchain.blocks[0].hash,
      transactions: [
        new Transaction({
          type: TransactionType.FEE,
          data: 'test data',
        } as Transaction),
      ],
      hash: 'abcd',
    } as Block)
    blockchain.addBlock(newBlock)
    const block = blockchain.getBlock(newBlock.hash)
    expect(block).toBeDefined()
    expect(block?.hash).toBe(newBlock.hash)
    expect(block?.transactions).toEqual([
      expect.objectContaining({
        data: 'test data',
        type: TransactionType.FEE,
      }),
    ])
  })

  it('should return undefined for non-existing block', () => {
    const blockchain = new Blockhain()
    const block = blockchain.getBlock(999)
    expect(block).toBeUndefined()
  })

  it('should get next block info', () => {
    const blockchain = new Blockhain()
    const nextBlockInfo = blockchain.getNextBlock()
    expect(nextBlockInfo.index).toBe(1)
    expect(nextBlockInfo.previousHash).toBe(blockchain.blocks[0].hash)
    expect(nextBlockInfo.difficulty).toBe(1)
    expect(nextBlockInfo.maxDifficulty).toBe(62)
    expect(nextBlockInfo.feePerTx).toBe(1)
  })
})
