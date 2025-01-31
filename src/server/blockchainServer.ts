import express, { RequestHandler } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import morgan from 'morgan'
import Blockchain from '../lib/blockchain'
import Block from '../lib/block'

const app = express()

if (process.argv.includes('--run')) app.use(morgan('tiny'))
app.use(express.json())

const blockchain = new Blockchain()

app.get('/status', (req, res) => {
  res.json({
    numberOfBlocks: blockchain.blocks.length,
    isValid: blockchain.isValid(),
    lastBlock: blockchain.getLastBlock(),
  })
})

app.get('/blocks/:indexOrHash', (req, res) => {
  const { indexOrHash } = req.params
  console.log('-> ', indexOrHash)
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
> = async (req, res) => {
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

if (process.argv.includes('--run'))
  app.listen(3000, () => {
    console.log('Blockchain server is running on http://localhost:3000')
  })

export { app }
