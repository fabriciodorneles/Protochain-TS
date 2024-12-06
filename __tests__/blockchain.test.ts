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

  it('should be invalid', () => {
    const blockchain = new Blockhain()
    blockchain.addBlock(new Block(1, '', 'abc'))
    expect(blockchain.isValid()).toBe(false)
  })
})
