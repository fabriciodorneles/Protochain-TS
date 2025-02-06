import Transaction from '../src/lib/transaction'
import { TransactionType } from '../src/lib/transactionType'

describe('Transaction', () => {
  it('should be valid', async () => {
    const transaction = new Transaction({
      type: TransactionType.FEE,
      data: new Date().toString(),
      timestamp: Date.now(),
    } as Transaction)
    const validation = transaction.isValid()
    expect(validation.success).toBeTruthy()
  })

  it('should be valid', async () => {
    const transaction = new Transaction({
      type: TransactionType.FEE,
      data: new Date().toString(),
    } as Transaction)
    const validation = transaction.isValid()
    expect(validation.success).toBeTruthy()
  })

  it('should be valid with invalid hash', async () => {
    const transaction = new Transaction({
      type: TransactionType.FEE,
      data: new Date().toString(),
      hash: 'abc',
    } as Transaction)
    transaction.hash = 'invalid hash'
    const validation = transaction.isValid()
    expect(validation.success).toBeFalsy()
  })

  it('should be valid with invalid hash', async () => {
    const transaction = new Transaction()
    const validation = transaction.isValid()
    expect(validation.success).toBeFalsy()
  })
})
