const request = require('supertest');
const app = require('./server');

describe('Test delle API POS', () => {
  it('Dovrebbe rispondere API POS ONLINE alla rotta principale', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('API POS ONLINE');
  });
});