import Blockhain from '../src/lib/blockchain'
import Block from '../src/lib/block'

jest.mock('../src/lib/block')

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
        data: 'Block 2',
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
        data: 'Block 2',
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
        data: 'Block 2',
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
        data: 'Block 2',
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
        data: 'Block 2',
      } as Block),
    )
    const block = blockchain.getBlock(1)
    expect(block).toBeDefined()
    expect(block?.index).toBe(1)
    expect(block?.data).toBe('Block 2')
  })

  it('should get the block by hash', () => {
    const blockchain = new Blockhain()
    const newBlock = new Block({
      index: 1,
      previousHash: blockchain.blocks[0].hash,
      data: 'Block 2',
      hash: 'abcd',
    } as Block)
    blockchain.addBlock(newBlock)
    const block = blockchain.getBlock(newBlock.hash)
    expect(block).toBeDefined()
    expect(block?.hash).toBe(newBlock.hash)
    expect(block?.data).toBe('Block 2')
  })

  it('should return undefined for non-existing block', () => {
    const blockchain = new Blockhain()
    const block = blockchain.getBlock(999)
    expect(block).toBeUndefined()
  })
})
