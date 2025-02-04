import dotenv from 'dotenv'
import express, { Request, RequestHandler, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import morgan from 'morgan'
import Blockchain from '../lib/blockchain'
import Block from '../lib/block'

dotenv.config()

const PORT: number = parseInt(process.env.PORT || '3000')

const app = express()

/* c8 ignore next */
if (process.argv.includes('--run')) app.use(morgan('tiny'))

app.use(express.json())

const blockchain = new Blockchain()

app.get('/status', (req: Request, res: Response) => {
  res.json({
    numberOfBlocks: blockchain.blocks.length,
    isValid: blockchain.isValid(),
    lastBlock: blockchain.getLastBlock(),
  })
})

app.get('/blocks/next', (req: Request, res: Response) => {
  res.json(blockchain.getNextBlock())
})

app.get('/blocks/:indexOrHash', (req: Request, res: Response) => {
  const { indexOrHash } = req.params
  const block = blockchain.getBlock(indexOrHash)

  if (block) {
    res.json(block)
  } else {
    res.status(404).json({ message: 'Block not found' })
  }
})

const postBlockHandler: RequestHandler<
  ParamsDictionary,
  Block | { message: string },
  Block
> = async (req: Request, res: Response) => {
  if (req.body.hash === undefined) {
    res.sendStatus(422)
    return
  }

  const newBlock = new Block(req.body as Block)
  const validation = blockchain.addBlock(newBlock)

  if (validation.success) res.status(201).json(newBlock)
  else res.status(400).json(validation)
}

app.post('/blocks', postBlockHandler)

/* c8 ignore next 4 */
if (process.argv.includes('--run'))
  app.listen(PORT, () =>
    console.log('Blockchain server is running on http://localhost:3000'),
  )

export { app }
