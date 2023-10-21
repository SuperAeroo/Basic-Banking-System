const { createUsers, getUsersById, updateUsers, deleteUsers } = require('../libs/users.libs');

module.exports = {
  createUsers: async (req, res, next) => {
    try {
      let { name, email, password } = req.body;

      try {
        let users = await createUsers(name, email, password);

        return res.status(201).json({
          status: false,
          message: 'OK',
          data: users
        });
      } catch (err) {
        return res.status(400).json({
          status: false,
          message: err,
          data: null
        });
      }
    } catch (err) {
      next(err);
    }
  },

  getUsersById: async (req, res, next) => {
    try {
      let { id } = req.params;
      try {
        let user = await getUsersById(Number(id));

        return res.status(200).json({
          status: false,
          message: 'OK',
          data: user
        });
      } catch (err) {
        return res.status(400).json({
          status: false,
          message: err,
          data: null
        });
      }
    } catch (err) {
      return res.status(400).json({
        status: false,
        message: err,
        data: null
      });
    }
  },

  updateUsers: async (req, res, next) => {
    try {
      let { id } = req.params;
      let newData = req.body; 

      try {
        let updatedUser = await updateUsers(Number(id), newData);

        return res.status(200).json({
          status: true,
          message: 'Berhasil memperbarui pengguna',
          data: updatedUser
        });
      } catch (err) {
        return res.status(400).json({
          status: false,
          message: err,
          data: null
        });
      }
    } catch (err) {
      next(err);
    }
  },

  deleteUsers: async (req, res, next) => {
    try {
      let { id } = req.params;

      try {
        await deleteUsers(Number(id));

        return res.status(200).json({
          status: true,
          message: 'Berhasil menghapus pengguna',
          data: null
        });
      } catch (err) {
        return res.status(400).json({
          status: false,
          message: err,
          data: null
        });
      }
    } catch (err) {
      next(err);
    }
  }

};