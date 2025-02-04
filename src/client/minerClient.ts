import axios from 'axios'
import BlockInfo from '../lib/blockInfo'
import Block from '../lib/block'
import dotenv from 'dotenv'
dotenv.config()

const BLOCKCHAIN_SERVER = process.env.BLOCKCHAIN_SERVER

const minerWallet = {
  privateKey: '123456',
  publicKey: `${process.env.MINER_WALLET}`,
}

console.log('Loggen in as miner: ', minerWallet.publicKey)

let totalMined = 0

async function mine() {
  console.log('Getting next block info...')
  const { data } = await axios.get(`${BLOCKCHAIN_SERVER}/blocks/next`)
  const blockInfo = data as BlockInfo
  const newBlock = Block.fromBlockInfo(blockInfo)

  // TODO: adicionar transação de recompensa ao minerador

  console.log('Start mining block #', blockInfo.index)

  newBlock.mine(blockInfo.difficulty, minerWallet.publicKey)
  console.log('Block mined! Sending to blockchain')
  try {
    await axios.post(`${BLOCKCHAIN_SERVER}/blocks`, newBlock)
    console.log('Block sent!')
    totalMined++
    console.log('Total mined blocks: ', totalMined)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(error.response ? error.response.data : error.message)
  }

  setTimeout(mine, 1000)
}

mine()
