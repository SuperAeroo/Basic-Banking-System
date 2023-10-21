const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
  createProfiles: async (user_id, identity_type, identity_number, address) => {
    try {
      const existUsers = await prisma.users.findUnique({ where: { id:user_id } });
      if (!existUsers) throw `User with an id ${user_id} not fund!`;

      const existProfile = await prisma.profiles.findUnique({ where: { user_id } });
      if (existProfile) throw `Profile with id user ${user_id} already exists!`;

      const profiles = await prisma.profiles.create({
        data: {
          user_id,
          identity_type,
          identity_number,
          address
        }
      });
      return profiles;
    } catch (err) {
      throw (err);
    }
  },

  getProfilesById: async (id) => {
    try {
      const profiles = await prisma.profiles.findUnique({ where: { id } });
      if (!profiles) throw 'Id doesn\'t exist!';

      return profiles;
    } catch (err) {
      throw err;
    }
  },

  updateProfiles: async (id, newData) => {
    try {
      const existingProfiles = await prisma.profiles.findUnique({
        where: { id }
      });
      if (!existingProfiles) throw 'profiles tidak ditemukan';

      const updateProfiles = await prisma.profiles.update({ where: { id }, data: newData });

      return updateProfiles;
    } catch (err) {
      throw err;
    }
  },

  deleteProfiles: async (id) => {
    try {
      const existingProfiles = await prisma.profiles.findUnique({ where: { id } });
      if (!existingProfiles) throw 'Id doesn\'t exist!';

      await prisma.profiles.delete({ where: { id } });
    } catch (err) {
      throw err;
    }
  }
};