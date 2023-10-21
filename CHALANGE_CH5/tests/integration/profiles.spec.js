const app = require('../../app');
const request = require('supertest');
let profiles = {};

describe('test POST /api/v1/profiles endpoint', () => {
  test('test user_id belum terdaftar -> sukses', async () => {
    try {
        let user_id = 3
        let identity_type = "e-ktp"
        let identity_number = "00998800"
        let address = "pekanbaru - riau"

        let { statusCode, body } = await request(app)
        .post('/api/v1/profiles')
        .send({ user_id, identity_type, identity_number, address });
        profiles = body.data;

        expect(statusCode).toBe(201);
        expect(body).toHaveProperty('status');
        expect(body).toHaveProperty('message');
        expect(body).toHaveProperty('data');
        expect(body.data).toHaveProperty('user_id');
        expect(body.data).toHaveProperty('identity_type');
        expect(body.data).toHaveProperty('identity_number');
        expect(body.data).toHaveProperty('address');
        expect(body.data.user_id).toBe(user_id);
        expect(body.data.identity_type).toBe(identity_type);
        expect(body.data.identity_number).toBe(identity_number);
        expect(body.data.address).toBe(address);
    } catch (err) {
        expect(err).toBe(`error`);
    }
  });

  test('test user_id tidak ditemukan -> error', async () => {
    try {
      let user_id = 3 + 1000
      let identity_type = "e-ktp"
      let identity_number = "00998800"
      let address = "pekanbaru - riau"

      let { statusCode, body } = await request(app)
      .post('/api/v1/profiles')
      .send({ user_id, identity_type, identity_number, address });

      expect(statusCode).toBe(400);
      expect(body).toHaveProperty('status');
      expect(body).toHaveProperty('message');
      expect(body).toHaveProperty('data');
    } catch (err) {
      expect(err).toBe(`User with an id ${user_id} not fund!`)
    }
  });
  test('test profile sudah ada -> error', async () => {
    try {
      let user_id = 3
      let identity_type = "e-ktp"
      let identity_number = "00998800"
      let address = "pekanbaru - riau"

      let { statusCode, body } = await request(app)
      .post('/api/v1/profiles')
      .send({ user_id, identity_type, identity_number, address });

      expect(statusCode).toBe(400);
      expect(body).toHaveProperty('status');
      expect(body).toHaveProperty('message');
      expect(body).toHaveProperty('data');
    } catch (err) {
      expect(err).toBe(`Profile with id user ${user_id} already exists!`)  
    }
  })
});


describe('test GET /api/v1/profiles/:id endpoint', () => {
  test('test cari profile dengan id yang tidak terdaftar -> error', async () => {
    try {
      try {
        let { statusCode, body } = await request(app)
        .get(`/api/v1/profiles/${profiles.id + 1000}`);

        expect(statusCode).toBe(400);
        expect(body).toHaveProperty('status');
        expect(body).toHaveProperty('message');
        expect(body).toHaveProperty('data');
      } catch (err) {
          expect(err).toBe('error');
      }
    } catch (err) {
      expect(err).toBe(`no profile found with id ${profiles.id + 1000}`);
  }
  });

  test('test cari profile dengan id yang terdaftar -> sukses', async () => {
    try {
      let { statusCode, body } = await request(app)
      .get(`/api/v1/profiles/${profiles.id}`);

      expect(statusCode).toBe(200);
      expect(body).toHaveProperty('status');
      expect(body).toHaveProperty('message');
      expect(body).toHaveProperty('data');
      expect(body.data).toHaveProperty('id');
      expect(body.data).toHaveProperty('user_id');
      expect(body.data).toHaveProperty('identity_type');
      expect(body.data).toHaveProperty('identity_number');
      expect(body.data).toHaveProperty('address');
      expect(body.data.id).toBe(profiles.id);
      expect(body.data.user_id).toBe(profiles.user_id);
      expect(body.data.identity_type).toBe(profiles.identity_type);
      expect(body.data.identity_number).toBe(profiles.identity_number);
      expect(body.data.address).toBe(profiles.address);
    } catch (err) {
      expect(err).toBe('error');
  }
  });

});

describe('test PUT /api/v1/profiles/:id endpoint', () => {
  test('test update profiles dengan ID yang tidak terdaftar -> Gagal', async () => {
    try {
      const newData = {
       user_id : 3,
       identity_type : "e-ktp2023",
       identity_number : "11998811",
       address : "lintas - riau"
      }

      const { statusCode, body } = await request(app)
      .put(`/api/v1/profiles/${profiles.id + 1000}`)
      .send(newData);

      expect(statusCode).toBe(400);
      expect(body).toHaveProperty('status');
      expect(body).toHaveProperty('message');
      expect(body).toHaveProperty('data');
    } catch (err) {
      expect(err).toBe('Id doesn\'t exist!');
    }
  });
  test('test update profiles dengan ID yang terdaftar -> Sukses', async () => {
    try {
      const newData = {
        user_id : 3,
        identity_type : "e-ktp2023",
        identity_number : "11998811",
        address : "lintas - riau"
       }
 
      const { statusCode, body } = await request(app)
      .put(`/api/v1/profiles/${profiles.id}`)
      .send(newData);

      expect(statusCode).toBe(200);
      expect(body).toHaveProperty('status');
      expect(body).toHaveProperty('message');
      expect(body).toHaveProperty('data');
      expect(body.data).toHaveProperty('id');
      expect(body.data).toHaveProperty('user_id');
      expect(body.data).toHaveProperty('identity_type');
      expect(body.data).toHaveProperty('identity_number');
      expect(body.data).toHaveProperty('address');
      expect(body.data.user_id).toBe(newData.user_id);
      expect(body.data.identity_type).toBe(newData.identity_type);
      expect(body.data.identity_number).toBe(newData.identity_number);
      expect(body.data.address).toBe(newData.address);
    } catch (err) {
      expect(err).toBe('Email is already used!')
    }
  });
})

describe('test DELETE /api/v1/profiles/:id', () => {
  test('test delete profile dengan ID yang tidak terdaftar -> Gagal', async () => {
    try {
      const { statusCode, body } = await request(app)
      .delete(`/api/v1/profiles/${profiles.id + 1000}`);

      expect(statusCode).toBe(400);
      expect(body).toHaveProperty('status');
      expect(body).toHaveProperty('message');
      expect(body).toHaveProperty('data');
    } catch (err) {
      expect(err).toBe('Id doesn\'t exist!');
    }
  });
  test('test delete profile dengan ID yang terdaftar -> Sukses', async () => {
    try {
      const { statusCode, body } = await request(app)
      .delete(`/api/v1/profiles/${profiles.id}`);

      expect(statusCode).toBe(200);
      expect(body).toHaveProperty('status');
      expect(body).toHaveProperty('message');
      expect(body).toHaveProperty('data');
    } catch (err) {
      expect(err).toBe('Id doesn\'t exist!');
    }    
    
  });
  
});
