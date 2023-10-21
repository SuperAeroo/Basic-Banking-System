const app = require('../../app');
const request = require('supertest');
let users = {};

describe('test POST /api/v1/users endpoint', () => {
  test('test email belum terdaftar -> sukses', async () => {
    try {
        let name = 'testinguser';
        let email = 'testinguser@mail.com';
        let password = 'testinguser123';

        let { statusCode, body } = await request(app)
        .post('/api/v1/users')
        .send({ name, email, password });
        users = body.data;

        expect(statusCode).toBe(201);
        expect(body).toHaveProperty('status');
        expect(body).toHaveProperty('message');
        expect(body).toHaveProperty('data');
        expect(body.data).toHaveProperty('id');
        expect(body.data).toHaveProperty('name');
        expect(body.data).toHaveProperty('email');
        expect(body.data).toHaveProperty('password');
        expect(body.data.name).toBe(name);
        expect(body.data.email).toBe(email);
        expect(body.data.password).toBe(password);
    } catch (err) {
        expect(err).toBe('error');
        
    }
  });

  test('test email sudah terdaftar -> error', async () => {
    try {
      let name = 'testinguser';
      let email = 'testinguser@mail.com';
      let password = 'testinguser123';

      let { statusCode, body } = await request(app)
      .post('/api/v1/users')
      .send({ name, email, password });

      expect(statusCode).toBe(400);
      expect(body).toHaveProperty('status');
      expect(body).toHaveProperty('message');
      expect(body).toHaveProperty('data');
    } catch (err) {
      expect(err).toBe('Email is already used!')
    }
  });
});


describe('test GET /api/v1/users/:id endpoint', () => {
  test('test cari user dengan id yang tidak terdaftar -> error', async () => {
    try {
      try {
          let { statusCode, body } = await request(app)
          .get(`/api/v1/users/${users.id + 1000}`);

          expect(statusCode).toBe(400);
          expect(body).toHaveProperty('status');
          expect(body).toHaveProperty('message');
          expect(body).toHaveProperty('data');
      } catch (err) {
          expect(err).toBe('error');
      }
    } catch (err) {
      expect(err).toBe(`no user found with id ${users.id + 1000}`);
  }
  });

  test('test cari user dengan id yang terdaftar -> sukses', async () => {
    try {
      let { statusCode, body } = await request(app)
      .get(`/api/v1/users/${users.id}`);

      expect(statusCode).toBe(200);
      expect(body).toHaveProperty('status');
      expect(body).toHaveProperty('message');
      expect(body).toHaveProperty('data');
      expect(body.data).toHaveProperty('id');
      expect(body.data).toHaveProperty('name');
      expect(body.data).toHaveProperty('email');
      expect(body.data).toHaveProperty('password');
      expect(body.data.id).toBe(users.id);
      expect(body.data.name).toBe(users.name);
      expect(body.data.email).toBe(users.email);
      expect(body.data.password).toBe(users.password);
    } catch (err) {
      expect(err).toBe('error');
  }
  });

});

describe('test PUT /api/v1/users/:id endpoint', () => {
  test('test update users dengan ID yang tidak terdaftar -> Gagal', async () => {
    try {
      const newData = {
        name : 'testinguser0',
        email : 'testinguser0@mail.com',
        password : 'testinguser123'
      }

      const { statusCode, body } = await request(app)
      .put(`/api/v1/users/${users.id + 1000}`)
      .send(newData);

      expect(statusCode).toBe(400);
      expect(body).toHaveProperty('status');
      expect(body).toHaveProperty('message');
      expect(body).toHaveProperty('data');

    } catch (err) {
      expect(err).toBe('Id doesn\'t exist!');
    }
  });
  test('test update users dengan ID yang terdaftar -> Sukses', async () => {
    try {
      const newData = {
        name : 'testinguser0',
        email : 'testinguser0@mail.com',
        password : 'testinguser123'
      }
      const { statusCode, body } = await request(app)
      .put(`/api/v1/users/${users.id}`)
      .send(newData);

      expect(statusCode).toBe(200);
      expect(body).toHaveProperty('status');
      expect(body).toHaveProperty('message');
      expect(body).toHaveProperty('data');
      expect(body.data).toHaveProperty('name')
      expect(body.data).toHaveProperty('email')
      expect(body.data).toHaveProperty('password')
      expect(body.data.name).toBe(newData.name)
      expect(body.data.email).toBe(newData.email)
      expect(body.data.password).toBe(newData.password)
    } catch (err) {
      expect(err).toBe('Email is already used!')
    }
  });
})

describe('test DELETE /api/v1/users/:id', () => {
  test('test delete pengguna dengan ID yang tidak terdaftar -> Gagal', async () => {
    try {
      const { statusCode, body } = await request(app)
      .delete(`/api/v1/users/${users.id + 1000}`);

      expect(statusCode).toBe(400);
      expect(body).toHaveProperty('status');
      expect(body).toHaveProperty('message');
      expect(body).toHaveProperty('data');
    } catch (err) {
      expect(err).toBe('Id doesn\'t exist!');
    }
  });
  test('test delete pengguna dengan ID yang terdaftar -> Sukses', async () => {
    try {
      const { statusCode, body } = await request(app)
      .delete(`/api/v1/users/${users.id}`);
  
      expect(statusCode).toBe(200);
      expect(body).toHaveProperty('status');
      expect(body).toHaveProperty('message');
      expect(body).toHaveProperty('data');
    } catch (err) {
      expect(err).toBe('Id doesn\'t exist!');
    }    
    
  });
  
});
