import Block from '../src/lib/block'

describe('Block', () => {
  it('should be valid', () => {
    const block = new Block(2, 'abc', 'data')
    expect(block.isValid()).toBe(true)
  })

  it('should be invalid (index)', () => {
    const block = new Block(-1, '', 'data')
    expect(block.isValid()).toBe(false)
  })

  it('should be invalid (previous hash)', () => {
    const block = new Block(0, '', 'data')
    expect(block.isValid()).toBe(false)
  })

  it('should be invalid (timestamp)', () => {
    const block = new Block(0, '', 'data')
    block.timestamp = -1
    expect(block.isValid()).toBe(false)
  })

  it('should be valid (timestamp >= 1)', () => {
    const block = new Block(0, '', 'data')
    block.timestamp = 1
    expect(block.isValid()).toBe(true)
  })

  it('should be invalid (data)', () => {
    const block = new Block(0, '', '')
    expect(block.isValid()).toBe(false)
  })

  it('should be invalid (hash)', () => {
    const block = new Block(0, 'abc', 'data')
    block.hash = ''
    expect(block.isValid()).toBe(false)
  })
})
