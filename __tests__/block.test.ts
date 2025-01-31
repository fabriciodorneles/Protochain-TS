import Block from '../src/lib/block'

describe('Block', () => {
  const exampleDifficulty = 0
  let genesis: Block

  beforeAll(() => {
    genesis = new Block({
      index: 0,
      previousHash: '',
      data: 'Genesis block',
    } as Block)
  })

  it('should be valid', async () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      data: 'Block 2',
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
      data: '',
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
      data: 'data',
    } as Block)
    expect(
      block.isValid(genesis.hash, genesis.index, exampleDifficulty).success,
    ).toBe(false)
  })

  it('should be invalid (previous hash)', () => {
    const block = new Block({
      index: 1,
      previousHash: '',
      data: 'data',
    } as Block)
    expect(
      block.isValid(genesis.hash, genesis.index, exampleDifficulty).success,
    ).toBe(false)
  })

  it('should be invalid (timestamp)', () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      data: 'data',
    } as Block)
    block.timestamp = -1
    expect(
      block.isValid(genesis.hash, genesis.index, exampleDifficulty).success,
    ).toBe(false)
  })

  it('should be invalid (data)', () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      data: '',
    } as Block)
    expect(
      block.isValid(genesis.hash, genesis.index, exampleDifficulty).success,
    ).toBe(false)
  })

  it('should be invalid (hash)', () => {
    const block = new Block({
      index: 1,
      previousHash: genesis.hash,
      data: 'data',
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
      data: 'data',
    } as Block)
    expect(
      block.isValid(genesis.hash, genesis.index, exampleDifficulty).success,
    ).toBe(false)
  })

  describe('Constructor', () => {
    it('should set default values when no parameters are provided', () => {
      const block = new Block()
      expect(block.index).toBe(0)
      expect(block.previousHash).toBe('')
      expect(block.data).toBe('')
      expect(block.hash).toBe(block.getHash())
      expect(block.timestamp).toBeLessThanOrEqual(Date.now())
    })

    it('should use provided values when parameters are given', () => {
      const timestamp = Date.now()
      const block = new Block({
        index: 1,
        timestamp,
        previousHash: 'abc',
        data: 'test data',
        hash: '123',
      } as Block)

      expect(block.index).toBe(1)
      expect(block.timestamp).toBe(timestamp)
      expect(block.previousHash).toBe('abc')
      expect(block.data).toBe('test data')
      expect(block.hash).toBe('123')
    })

    it('should handle partial parameters', () => {
      const block = new Block({
        index: 1,
        data: 'test data',
      } as Block)

      expect(block.index).toBe(1)
      expect(block.data).toBe('test data')
      expect(block.previousHash).toBe('')
      expect(block.hash).toBe(block.getHash())
      expect(block.timestamp).toBeLessThanOrEqual(Date.now())
    })
  })
})
