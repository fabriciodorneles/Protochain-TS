import request from 'supertest'
import { app } from '../src/server/blockchainServer'
import Transaction from '../src/lib/transaction'
import { TransactionType } from '../src/lib/transactionType'

jest.mock('../src/lib/block')
jest.mock('../src/lib/blockchain')

describe('BlockchainServer', () => {
  test('GET /status should return status', async () => {
    const response = await request(app).get('/status')
    expect(response.status).toBe(200)
    expect(response.body.numberOfBlocks).toBe(1)
    expect(response.body.isValid).toEqual({
      message: 'Blockchain is valid',
      success: true,
    })
    expect(response.body.lastBlock.transactions).toEqual([
      expect.objectContaining({
        type: TransactionType.FEE,
        data: expect.any(String),
      }),
    ])
    expect(response.body.lastBlock.index).toBe(0)
  })

  test('GET /blocks/next should get next block info', async () => {
    const response = await request(app).get('/blocks/next')
    expect(response.status).toBe(200)
    expect(response.body.index).toBe(1)
  })

  test('GET /blocks/:indexOrHash should return genesis with index', async () => {
    const response = await request(app).get('/blocks/0')
    expect(response.status).toBe(200)
    expect(response.body.transactions).toEqual([
      expect.objectContaining({
        type: TransactionType.FEE,
        data: expect.any(String),
      }),
    ])
    expect(response.body.index).toBe(0)
  })

  test('GET /blocks/:indexOrHash should return genesis with hash', async () => {
    const response = await request(app).get('/blocks/abc')
    expect(response.status).toBe(200)
    expect(response.body.transactions).toEqual([
      expect.objectContaining({
        type: TransactionType.FEE,
        data: expect.any(String),
      }),
    ])
    expect(response.body.index).toBe(0)
  })

  test('GET /blocks/:indexOrHash should return 401 with wrong data', async () => {
    const response = await request(app).get('/blocks/1')
    expect(response.status).toBe(404)
    expect(response.body.message).toBe('Block not found')
  })

  test('POST /blocks should return new block', async () => {
    const response = await request(app)
      .post('/blocks')
      .send({
        hash: '',
        index: 1,
        transactions: [
          new Transaction({
            type: TransactionType.FEE,
            data: 'Block 2',
          } as Transaction),
        ],
      })
    expect(response.status).toBe(201)
    expect(response.body.transactions).toEqual([
      expect.objectContaining({
        type: TransactionType.FEE,
        data: expect.any(String),
      }),
    ])
  })

  test('POST /blocks should return new block', async () => {
    const response = await request(app)
      .post('/blocks')
      .send({
        hash: '',
        index: -1,
        transactions: [
          new Transaction({
            type: TransactionType.FEE,
            data: 'Block 2',
          } as Transaction),
        ],
        previousHash: 'abc',
      })
    expect(response.status).toBe(400)
    expect(response.body.message).toBe('Invalid mock block')
  })

  test('POST /blocks should return 422 if data is invalid', async () => {
    const response = await request(app).post('/blocks').send({})
    expect(response.status).toBe(422)
  })
})
