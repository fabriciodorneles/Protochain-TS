import Blockhain from '../src/lib/blockchain'
import Block from '../src/lib/block'

describe('Blockchain', () => {
  it('Should has genesis block', () => {
    const blockchain = new Blockhain()
    expect(blockchain.blocks.length).toBe(1)
  })

  it('should be valid', () => {
    const blockchain = new Blockhain()
    expect(blockchain.isValid()).toBe(true)
  })

  it('should add a new block', () => {
    const blockchain = new Blockhain()
    const result = blockchain.addBlock(
      new Block(1, blockchain.blocks[0].hash, 'Block 2'),
    )
    expect(result).toBe(true)
    expect(blockchain.blocks.length).toBe(2)
  })

  it('should not add block if new block is invalid', () => {
    const blockchain = new Blockhain()
    const result = blockchain.addBlock(
      new Block(-1, blockchain.blocks[0].hash, 'Block 2'),
    )
    expect(result).toBe(false)
    expect(blockchain.blocks.length).toBe(1)
  })

  it('should be valid with two blocks', () => {
    const blockchain = new Blockhain()
    blockchain.addBlock(new Block(1, blockchain.blocks[0].hash, 'Block 2'))
    expect(blockchain.isValid()).toBe(true)
  })

  it('should not be valid if block is changed', () => {
    const blockchain = new Blockhain()
    blockchain.addBlock(new Block(1, blockchain.blocks[0].hash, 'Block 2'))
    blockchain.blocks[1].data = 'Block 3'
    expect(blockchain.isValid()).toBe(false)
  })
})
