import addExpense from '../../util/splitwise-util'
import { TransactionBuilder } from '../../model/transaction'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handleMessage(req: NextApiRequest, res: NextApiResponse) {
    console.log("handleMessage")
    res.statusCode = 200;
}
  