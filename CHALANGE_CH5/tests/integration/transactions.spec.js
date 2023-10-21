const app = require('../../app');
const request = require('supertest');
let transactions = {};

describe('test POST /api/v1/transactions endpoint', () => {
  test('test id account terdaftar -> sukses', async () => {
    try {
      let source_account_id = 1
      let destination_account_id = 2
      let amount = 10000
      
      let { statusCode, body } = await request(app)
      .post('/api/v1/transactions')
      .send({source_account_id,destination_account_id,amount})
      // let a = await request(app).post('/api/v1/transactions').send({source_account_id,destination_account_id,amount,})
      transactions = body.data;
      // return console.log(a);
      
      expect(statusCode).toBe(201);
      expect(body).toHaveProperty('status');
      expect(body).toHaveProperty('message');
      expect(body).toHaveProperty('data');
      expect(body.data).toHaveProperty('id');
      expect(body.data).toHaveProperty('source_account_id');
      expect(body.data).toHaveProperty('destination_account_id');
      expect(body.data).toHaveProperty('amount');
      expect(body.data.source_account_id).toBe(source_account_id);
      expect(body.data.destination_account_id).toBe(destination_account_id);
      expect(body.data.amount).toBe(amount);
    } catch (err) {
      expect(err).toBe('error');
    }
  });

  test('test id account tidak terdaftar -> error', async () => {
    try {
      let source_account_id = 1 + 1000;
      let destination_account_id = 1;
      let amount = 1000;

      let { statusCode, body } = await request(app)
      .post('/api/v1/transactions')
      .send({ source_account_id, destination_account_id, amount, });

      expect(statusCode).toBe(400)
      expect(body).toHaveProperty('status');
      expect(body).toHaveProperty('message');
      expect(body).toHaveProperty('data');
    } catch (err) {
      console.log(err);
      expect(err).toBe('Source Id Or Destination Not Found!');
    }
  });

  test('test saldo tidak mencukupi -> error', async () => {
    try {
      let source_account_id = 1;
      let destination_account_id = 2;
      let amount = 9000000;

      let { statusCode, body } = await request(app)
      .post('/api/v1/transactions')
      .send({ source_account_id, destination_account_id, amount, });

      expect(statusCode).toBe(400);
      expect(body).toHaveProperty('status');
      expect(body).toHaveProperty('message');
      expect(body).toHaveProperty('data');
    } catch (err) {
      expect(err).toBe('saldo tidak mencukupi');
    }
  });
});

describe('test GET /api/v1/transactions/:id endpoint', () => {
  
  test('test cari transactions dengan id yang tidak terdaftar -> error', async () => {
    try {
      try {
        let { statusCode, body } = await request(app).get(`/api/v1/transactions/${transactions.id + 1000}`);

        expect(statusCode).toBe(400);
        expect(body).toHaveProperty('status');
        expect(body).toHaveProperty('message');
        expect(body).toHaveProperty('data');
      } catch (err) {
          expect(err).toBe('error');
        }
      } catch (err) {
        expect('id tidak ditemukan');
      }
    });
    test('test cari transactions dengan id yang terdaftar -> sukses', async () => {
      try {
        let { statusCode, body } = await request(app).get(`/api/v1/transactions/${transactions.id}`);
  
        expect(statusCode).toBe(200);
        expect(body).toHaveProperty('status');
        expect(body).toHaveProperty('message');
        expect(body).toHaveProperty('data');
        expect(body.data).toHaveProperty('source_account_id');
        expect(body.data).toHaveProperty('destination_account_id');
        expect(body.data).toHaveProperty('amount');
        expect(body.data.source_account_id).toBe(transactions.source_account_id);
        expect(body.data.destination_account_id).toBe(transactions.destination_account_id);
        expect(body.data.amount).toBe(transactions.amount);
      } catch (err) {
        expect(err).toBe('error');
      }
    });
  });

describe('test PUT /api/v1/transactions/:id endpoint', () => {
  
  test('test PUT transactions dengan ID yang tidak terdaftar -> Gagal', async () => {
    try {
      const newData = {
        source_account_id: 2,
        destination_account_id: 1,
        amount: 20000
      };

      const { statusCode, body } = await request(app)
      .put(`/api/v1/transactions/${transactions.id + 1000}`)
      .send(newData);

      expect(statusCode).toBe(400);
      expect(body).toHaveProperty('status');
      expect(body).toHaveProperty('message');
      expect(body).toHaveProperty('data');
    } catch (err) {
        expect(err).toBe('transactions doesn\'t exist!');
    }
  });
  test('test PUT transactions dengan ID yang terdaftar -> Sukses', async () => {
    try {
      const newData = {
        source_account_id: 2,
        destination_account_id: 1,
        amount: 20000
      };

      const { statusCode, body } = await request(app)
        .put(`/api/v1/transactions/${transactions.id}`)
        .send(newData);

      expect(statusCode).toBe(200);
      expect(body).toHaveProperty('status');
      expect(body).toHaveProperty('message');
      expect(body).toHaveProperty('data');
      expect(body.data).toHaveProperty('id');
      expect(body.data).toHaveProperty('source_account_id');
      expect(body.data).toHaveProperty('destination_account_id');
      expect(body.data).toHaveProperty('amount');
      expect(body.data.source_account_id).toBe(newData.source_account_id);
      expect(body.data.destination_account_id).toBe(newData.destination_account_id);
      expect(body.data.amount).toBe(newData.amount);

    } catch (err) {
        expect(err).toBe('error');
    }
  });
});

describe('test DELETE /api/v1/transactions/:id endpoint', () => {
  
  test('test DELETE transactions dengan ID yang tidak terdaftar -> Gagal', async () => {
    try {
      const { statusCode, body } = await request(app).delete(`/api/v1/transactions/${transactions.id + 1000}`);

      expect(statusCode).toBe(400);
      expect(body).toHaveProperty('status');
      expect(body).toHaveProperty('message');
      expect(body).toHaveProperty('data');
    } catch (err) {
      expect(err).toBe('transactions doesn\'t exist!');
    }
  });
  test('test DELETE transactions dengan ID yang terdaftar -> Sukses', async () => {
    try {
      const { statusCode, body } = await request(app).delete(`/api/v1/transactions/${transactions.id}`);
      
      expect(statusCode).toBe(200);
      expect(body).toHaveProperty('status');
      expect(body).toHaveProperty('message');
      expect(body).toHaveProperty('data');
    } catch (err) {
      expect(err).toBe('transactions doesn\'t exist!');
    }
  });
});
