const app = require('../../app');
const request = require('supertest');
let accounts = {};

describe('test POST /api/v1/accounts endpoint', () => {
  test('test user id terdaftar -> sukses', async () => {
    try {
      let user_id = 1;
      let bank_name = "asep_acc";
      let bank_account_number = "11223311";
      let balance = 100000;

      let { statusCode, body } = await request(app)
      .post('/api/v1/accounts')
      .send({ user_id, bank_name, bank_account_number, balance });
      accounts = body.data;

      expect(statusCode).toBe(201);
      expect(body).toHaveProperty('status');
      expect(body).toHaveProperty('message');
      expect(body).toHaveProperty('data');
      expect(body.data).toHaveProperty('user_id');
      expect(body.data).toHaveProperty('bank_name');
      expect(body.data).toHaveProperty('bank_account_number');
      expect(body.data).toHaveProperty('balance');
      expect(body.data.user_id).toBe(user_id);
      expect(body.data.bank_name).toBe(bank_name);
      expect(body.data.bank_account_number).toBe(bank_account_number);
      expect(body.data.balance).toBe(balance);
    } catch (err) {
      expect(err).toBe('error')
    }
  });

  test('test user id tidak terdaftar -> error', async () => {
    try {
      let user_id = 1 + 1000;
      let bank_name = "asep_acc";
      let bank_account_number = "11223311";
      let balance = "100000";

      let { statusCode, body } = await request(app)
      .post('/api/v1/accounts')
      .send({ user_id, bank_name, bank_account_number, balance });

      expect(statusCode).toBe(400);
      expect(body).toHaveProperty('status');
      expect(body).toHaveProperty('message');
      expect(body).toHaveProperty('data');
    } catch (err) {
      expect(err).toBe('User doesn\'t exist!');
    }
  });
});

describe('test GET /api/v1/accounts/:id endpoint', () => {
  test('test GET accounts dengan id yang tidak terdaftar -> error', async () => {
    try {
      let { statusCode, body } = await request(app)
      .get(`/api/v1/accounts/${accounts.id + 1000}`);

        expect(statusCode).toBe(400);
        expect(body).toHaveProperty('status');
        expect(body).toHaveProperty('message');
        expect(body).toHaveProperty('data');
    } catch (err) {
      expect('Id doesn\'t exist!');
    }
  });

  test('test GET accounts dengan id yang terdaftar -> sukses', async () => {
    try {
      try {
        let { statusCode, body } = await request(app)
      .get(`/api/v1/accounts/${accounts.id}`);

      expect(statusCode).toBe(200);
      expect(body).toHaveProperty('status');
      expect(body).toHaveProperty('message');
      expect(body).toHaveProperty('data');
      expect(body.data).toHaveProperty('user_id');
      expect(body.data).toHaveProperty('bank_name');
      expect(body.data).toHaveProperty('bank_account_number');
      expect(body.data).toHaveProperty('balance');
      expect(body.data.user_id).toBe(accounts.user_id);
      expect(body.data.bank_name).toBe(accounts.bank_name);
      expect(body.data.bank_account_number).toBe(accounts.bank_account_number);
      expect(body.data.balance).toBe(accounts.balance);
      } catch (err) {
        expect(err).toBe('error');
      }
    } catch (err) {
      expect('Id doesn\'t exist!');
    }
  });
});

describe('test PUT /api/v1/accounts/:id endpoint', () => {
  
  test('test PUT accounts dengan ID yang tidak terdaftar -> Gagal', async () => {
    try {
      const newData = {
        user_id: 1,
        bank_name: 'asep_accsultan',
        bank_account_number: '99223399',
        balance: 50000
      };
      
      const { statusCode, body } = await request(app)
      .put(`/api/v1/accounts/${accounts.id + 1000}`)
      .send(newData);
      
      expect(statusCode).toBe(400);
      expect(body).toHaveProperty('status');
      expect(body).toHaveProperty('message');
      expect(body).toHaveProperty('data');
    } catch (err) {
      expect(err).toBe('accounts doesn\'t exist!');
    }
  });
  test('test PUT accounts dengan ID yang terdaftar -> Sukses', async () => {
    try {
      const newData = {
        user_id: 1,
        bank_name: 'asep_accsultan',
        bank_account_number: '99223399',
        balance: 50000
      };

      const { statusCode, body } = await request(app)
      .put(`/api/v1/accounts/${accounts.id}`)
      .send(newData);

      expect(statusCode).toBe(200);
      expect(body).toHaveProperty('status');
      expect(body).toHaveProperty('message');
      expect(body).toHaveProperty('data');
      expect(body.data).toHaveProperty('user_id');
      expect(body.data).toHaveProperty('bank_name');
      expect(body.data).toHaveProperty('bank_account_number');
      expect(body.data).toHaveProperty('balance');
      expect(body.data.user_id).toBe(newData.user_id);
      expect(body.data.bank_name).toBe(newData.bank_name);
      expect(body.data.bank_account_number).toBe(newData.bank_account_number);
      expect(body.data.balance).toBe(newData.balance);

    } catch (err) {
      expect(err).toBe('error');
    }
  });
});

describe('test DELETE /api/v1/accounts/:id endpoint', () => {
  
  test('test DELETE accounts dengan ID yang tidak terdaftar -> Gagal', async () => {
    try {
      const { statusCode, body } = await request(app)
      .delete(`/api/v1/accounts/${accounts.id + 1000}`);
      
      expect(statusCode).toBe(400);
      expect(body).toHaveProperty('status');
      expect(body).toHaveProperty('message');
      expect(body).toHaveProperty('data');
    } catch (err) {
      expect(err).toBe('accounts doesn\'t exist!')
    }
  });
  test('test DELETE accounts dengan ID yang terdaftar -> Sukses', async () => {
    try {
      const { statusCode, body } = await request(app)
      .delete(`/api/v1/accounts/${accounts.id}`);

      expect(statusCode).toBe(200);
      expect(body).toHaveProperty('status');
      expect(body).toHaveProperty('message');
      expect(body).toHaveProperty('data');
    } catch (err) {
      expect(err).toBe('Id doesn\'t exist!');
    }
  });
})