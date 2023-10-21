const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
  createAccounts: async (user_id, bank_name, bank_account_number, balance) => {
    try {

      const existuser = await prisma.users.findUnique({ where: { id : user_id } });
      if (!existuser) throw 'User doesn\'t exist!';

      const accounts = await prisma.bank_Accounts.create({
        data: {
          user_id,
          bank_name,
          bank_account_number,
          balance
        }
      });
      return accounts;
    } catch (err) {
      throw (err);
    }
  },

  getAccountsById: async (id) => {
    try {
      const accounts = await prisma.bank_Accounts.findUnique({ where: { id } });
      if (!accounts) throw 'Id doesn\'t exist!';

      return accounts;
    } catch (err) {
      throw err;
    }
  },

  updateAccounts: async (id, newData) => {
    try {
      const existingAccounts = await prisma.bank_Accounts.findUnique({ where: { id } });
      if (!existingAccounts) throw 'accounts doesn\'t exist!';

      const updatedAccounts = await prisma.bank_Accounts.update({ where: { id }, data: newData });

      return updatedAccounts;
    } catch (err) {
      throw err;
    }
  },

  deleteAccounts: async (id) => {
    try {
      const existingAccounts = await prisma.bank_Accounts.findUnique({ where: { id } });
      if (!existingAccounts) throw 'accounts doesn\'t exist!';

      await prisma.bank_Accounts.delete({ where: { id } });
    } catch (err) {
      throw err;
    }
  }
};