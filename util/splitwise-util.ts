import {Transaction} from '../model/transaction'
const Splitwise = require('splitwise')
const sw = Splitwise({
  consumerKey: process.env.splitwiseConsumerSecretKey,
  consumerSecret: process.env.splitwiseConsumerSecret
})
const groupId = process.env.splitwiseGroupId

/**
 * Adds a transaction to Splitwise
 * @param transaction 
 */
async function addExpense(transaction: Transaction) {
    var group = await sw.getGroup({id: groupId});
    var member1 = group.members[0]
    var member2 = group.members[1]
    // TODO: allow input from user to make configurable
    var riyazId = null
    var xioId = null
    if (member1.first_name === 'Riyaz') {
        riyazId = member1.id
        xioId = member2.id
    } else {
        riyazId = member2.id
        xioId = member1.id
    }
    var riyazPays = transaction.riyazPays;
    var xioPays = transaction.xioPays;
    if (!transaction.isAbsoluteAmounts) {
      riyazPays = +(transaction.totalAmount * (transaction.riyazPays / 100)).toFixed(2);
      xioPays = transaction.totalAmount - riyazPays
    }
    console.log(transaction.date)
    await sw.createExpense({
        description: transaction.description,
        group_id: groupId,
        payment: false,
        cost: transaction.totalAmount,
        date: transaction.date,
        users: [
          {
            user_id: riyazId,
            paid_share: transaction.totalAmount,
            owed_share: riyazPays
          },
          {
            user_id: xioId,
            owed_share: xioPays
          },
        ],
    });
}

export default addExpense