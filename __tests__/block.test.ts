import Block from '../src/lib/block'
import BlockInfo from '../src/lib/blockInfo'
import Transaction from '../src/lib/transaction'
import { TransactionType } from '../src/lib/transactionType'

jest.mock('../src/lib/transaction')

describe('Block', () => {
  const exampleDifficulty = 0
  let genesis: Block

  beforeAll(() => {
    genesis = new Block({
      index: 0,
      previousHash: '',
      transactions: [
        new Transaction({
          type: TransactionType.FEE,
          data: new Date().toString(),
        } as Transaction),
      ],
    } as Block)
  })

  it('should be valid', async () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      transactions: [
        new Transaction({
          type: TransactionType.FEE,
          data: new Date().toString(),
        } as Transaction),
      ],
    } as Block)
    block.mine(exampleDifficulty, 'miner')
    const validation = block.isValid(
      genesis.hash,
      genesis.index,
      exampleDifficulty,
    )
    expect(validation.success).toBeTruthy()
    expect(validation.message).toBe('Block is valid')
  })

  it('should create a block with no parameter', () => {
    const block = new Block({} as Block)
    expect(block).toEqual({
      transactions: [] as Transaction[],
      hash: block.getHash(),
      index: 0,
      miner: '',
      nonce: 0,
      previousHash: '',
      timestamp: block.timestamp,
    } as Block)
  })

  it('should be invalid (index)', () => {
    const block = new Block({
      index: -1,
      previousHash: genesis.hash,
      transactions: [
        new Transaction({
          type: TransactionType.FEE,
          data: new Date().toString(),
        } as Transaction),
      ],
    } as Block)
    expect(
      block.isValid(genesis.hash, genesis.index, exampleDifficulty).success,
    ).toBe(false)
  })

  it('should be invalid (previous hash)', () => {
    const block = new Block({
      index: 1,
      previousHash: '',
      transactions: [
        new Transaction({
          type: TransactionType.FEE,
          data: new Date().toString(),
        } as Transaction),
      ],
    } as Block)
    expect(
      block.isValid(genesis.hash, genesis.index, exampleDifficulty).success,
    ).toBe(false)
  })

  it('should be invalid (timestamp)', () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      transactions: [
        new Transaction({
          type: TransactionType.FEE,
          data: new Date().toString(),
        } as Transaction),
      ],
    } as Block)
    block.timestamp = -1
    expect(
      block.isValid(genesis.hash, genesis.index, exampleDifficulty).success,
    ).toBe(false)
  })

  it('should be invalid (hash)', () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      transactions: [
        new Transaction({
          type: TransactionType.FEE,
          data: new Date().toString(),
        } as Transaction),
      ],
    } as Block)
    block.mine(exampleDifficulty, 'miner')
    block.hash = ''
    expect(
      block.isValid(genesis.hash, genesis.index, exampleDifficulty).success,
    ).toBe(false)
  })

  it('should be invalid (no mined)', () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      transactions: [
        new Transaction({
          type: TransactionType.FEE,
          data: new Date().toString(),
        } as Transaction),
      ],
    } as Block)
    expect(
      block.isValid(genesis.hash, genesis.index, exampleDifficulty).success,
    ).toBe(false)
  })

  it('should return invalid when transactions have errors', () => {
    const block = new Block({
      index: 1,
      previousHash: 'abc',
      transactions: [
        new Transaction({
          type: TransactionType.FEE,
          data: 'tx',
        } as Transaction),
        new Transaction({
          type: TransactionType.FEE,
          data: 'tx',
        } as Transaction),
      ],
    } as Block)

    const validation = block.isValid(
      genesis.hash,
      genesis.index,
      exampleDifficulty,
    )

    expect(validation.success).toBeFalsy()
    expect(validation.message).toContain('To many fee transactions')
  })
  it('should return invalid when transactions have errors', () => {
    const block = new Block({
      index: 1,
      previousHash: 'abc',
      transactions: [
        new Transaction({
          type: TransactionType.FEE,
          data: 'tx',
        } as Transaction),
        new Transaction({
          type: TransactionType.REGULAR,
          data: '',
        } as Transaction),
      ],
    } as Block)

    const validation = block.isValid(
      genesis.hash,
      genesis.index,
      exampleDifficulty,
    )

    expect(validation.success).toBeFalsy()
    expect(validation.message).toContain(
      'invalid block due transaction(s) error: Invalid data',
    )
  })

  describe('Constructor', () => {
    it('should set default values when no parameters are provided', () => {
      const block = new Block()
      expect(block.index).toBe(0)
      expect(block.previousHash).toBe('')
      expect(block.transactions).toEqual([])
      expect(block.hash).toBe(block.getHash())
      expect(block.timestamp).toBeLessThanOrEqual(Date.now())
    })

    it('should use provided values when parameters are given', () => {
      const timestamp = Date.now()
      const block = new Block({
        index: 1,
        timestamp,
        previousHash: 'abc',
        transactions: [
          new Transaction({
            type: TransactionType.FEE,
            data: 'test data',
          } as Transaction),
        ],
        hash: '123',
      } as Block)

      expect(block.index).toBe(1)
      expect(block.timestamp).toBe(timestamp)
      expect(block.previousHash).toBe('abc')
      expect(block.transactions).toEqual([
        expect.objectContaining({
          type: TransactionType.FEE,
          data: 'test data',
        }),
      ])
      expect(block.hash).toBe('123')
    })

    it('should handle partial parameters', () => {
      const block = new Block({
        index: 1,
        transactions: [
          new Transaction({
            type: TransactionType.FEE,
            data: 'test data',
          } as Transaction),
          new Transaction({
            type: TransactionType.FEE,
            data: 'test data 2',
          } as Transaction),
        ],
      } as Block)

      expect(block.index).toBe(1)
      expect(block.transactions).toEqual([
        expect.objectContaining({
          type: TransactionType.FEE,
          data: 'test data',
        }),
        expect.objectContaining({
          type: TransactionType.FEE,
          data: 'test data 2',
        }),
      ])
      expect(block.previousHash).toBe('')
      expect(block.hash).toBe(block.getHash())
      expect(block.timestamp).toBeLessThanOrEqual(Date.now())
    })

    it('should create a block from block info', () => {
      const blockInfo: BlockInfo = {
        index: 1,
        previousHash: genesis.hash,
        difficulty: 0,
        maxDifficulty: 62,
        feePerTx: 5,
        transactions: [
          new Transaction({
            type: TransactionType.FEE,
            data: 'test data',
          } as Transaction),
        ],
      }
      const block = Block.fromBlockInfo(blockInfo)
      block.mine(0, 'miner')
      expect(block).toEqual({
        transactions: [
          expect.objectContaining({
            type: TransactionType.FEE,
            data: 'test data',
          }),
        ],
        hash: block.getHash(),
        index: 1,
        miner: 'miner',
        nonce: 1,
        previousHash: genesis.hash,
        timestamp: block.timestamp,
      } as Block)
    })
  })
})
