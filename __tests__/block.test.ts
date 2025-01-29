import Block from '../src/lib/block'

describe('Block', () => {
  let genesis: Block

  beforeAll(() => {
    genesis = new Block(0, '', 'Genesis block')
  })

  it('should be valid', () => {
    const block = new Block(1, genesis.hash, 'data')
    expect(block.isValid(genesis.hash, genesis.index)).toBe(true)
  })

  it('should be invalid (index)', () => {
    const block = new Block(-1, genesis.hash, 'data')
    expect(block.isValid(genesis.hash, genesis.index)).toBe(false)
  })

  it('should be invalid (previous hash)', () => {
    const block = new Block(1, '', 'data')
    expect(block.isValid(genesis.hash, genesis.index)).toBe(false)
  })

  it('should be invalid (timestamp)', () => {
    const block = new Block(1, genesis.hash, 'data')
    block.timestamp = -1
    expect(block.isValid(genesis.hash, genesis.index)).toBe(false)
  })

  it('should be invalid (data)', () => {
    const block = new Block(1, genesis.hash, '')
    expect(block.isValid(genesis.hash, genesis.index)).toBe(false)
  })

  it('should be invalid (hash)', () => {
    const block = new Block(1, genesis.hash, 'data')
    block.hash = ''
    expect(block.isValid(genesis.hash, genesis.index)).toBe(false)
  })
})
