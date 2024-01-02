import request from 'supertest';
import app from '@/app';

describe('POST /qrcode', () => {
  it('should return qrcode correctly', async () => {
    const url = 'https://drawflux.onrender.com';

    const response = await request(app).post('/qrcode').send({ url });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('dataUrl');
    expect(typeof response.body.dataUrl).toBe('string');
  });
});
