const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
  newTransactions: async (source_account_id, destination_account_id, amount) => {
    try {
      const existSourceId = await prisma.bank_Accounts.findUnique({ where: { id : source_account_id } });
      const existDestinationId = await prisma.bank_Accounts.findUnique({ where: { id : destination_account_id } });

      if (!existSourceId || !existDestinationId ) throw 'Source Id Or Destination Not Found!';

      if (existSourceId.balance < amount ) throw 'saldo tidak mencukupi'


      const transactions = await prisma.transactions.create({
        data: {
          source_account_id,
          destination_account_id,
          amount
        }
      });
      await prisma.bank_Accounts.update({ where:{id : existSourceId},data:{balance: {decrement: amount}} })
      await prisma.bank_Accounts.update({ where:{id : existDestinationId},data:{balance: {increment: amount}} })
      return transactions;
    } catch (err) {
      // console.log(err);
      throw (err);
    }
  },

  getTransactionsById: async (id) => {
    try {
      const transactions = await prisma.transactions.findUnique({ where: { id } });
      if (!transactions) throw 'Id doesn\'t exist!';

      return transactions;
    } catch (err) {
      throw err;
    }
  },

  updateTransactions: async (id, newData) => {
    try {
      const existingTransactions = await prisma.transactions.findUnique({ where: { id } });
      if (!existingTransactions) throw 'transactions doesn\'t exist!';

      const updatedTransactions = await prisma.transactions.update({ where: { id }, data: newData });

      return updatedTransactions;
    } catch (err) {
      throw err;
    }
  },

  deleteTransactions: async (id) => {
    try {
      const existingTransactions = await prisma.transactions.findUnique({ where: { id } });
      if (!existingTransactions) throw 'transactions doesn\'t exist!';

      await prisma.transactions.delete({ where: { id } });
    } catch (err) {
      throw err;
    }
  }
};