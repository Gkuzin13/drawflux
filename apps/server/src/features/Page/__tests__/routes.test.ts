import { randomUUID } from 'node:crypto';
import type {
  NodeObject,
  SharePageRequestBody,
  GetPageResponse,
  StageConfig,
} from 'shared';
import request from 'supertest';
import app from '@/app';
import * as db from '@/database/index';
import * as mutators from '../mutators/index';

const mockNode: NodeObject = {
  nodeProps: { id: randomUUID(), point: [0, 0], rotation: 0, visible: true },
  style: {
    size: 'extra-large',
    animated: false,
    color: 'black',
    line: 'solid',
    opacity: 1,
  },
  type: 'arrow',
  text: null,
};

const mockStageConfig: StageConfig = { position: { x: 0, y: 0 }, scale: 1 };

describe('db queries', () => {
  beforeEach(async () => {
    await mutators.createPagesTable();
  });

  afterEach(async () => {
    const client = await db.getClient();

    try {
      await db.query('DROP TABLE IF EXISTS pages;');
    } catch (error) {
      console.log(error);
    } finally {
      client.release();
    }
  });

  describe('PATCH /p/:id', () => {
    it('should patch correctly', async () => {
      const mockPage: SharePageRequestBody = {
        page: {
          stageConfig: mockStageConfig,
          nodes: [mockNode],
        },
      };

      const postResponse = await request(app).post('/p').send(mockPage);
      const response = await request(app)
        .patch(`/p/${postResponse.body.data.id}`)
        .send({ nodes: mockPage.page.nodes });

      expect(response.status).toBe(200);
      expect(typeof response.body.data.id).toBe('string');
    });
  });

  describe('POST /p', () => {
    it('should return the page', async () => {
      const mockPage: SharePageRequestBody = {
        page: {
          stageConfig: mockStageConfig,
          nodes: [mockNode],
        },
      };

      const response = await request(app).post('/p').send(mockPage);

      expect(response.status).toBe(200);
      expect(typeof response.body.data.id).toBe('string');
    });
  });

  describe('GET /p/:id', () => {
    it('should return the page', async () => {
      const mockPage: SharePageRequestBody = {
        page: {
          stageConfig: mockStageConfig,
          nodes: [mockNode],
        },
      };

      const postResponse = await request(app).post('/p').send(mockPage);
      const getResponse = await request(app)
        .get(`/p/${postResponse.body.data.id}`)
        .send();

      const returnedPage: GetPageResponse = {
        page: {
          ...mockPage.page,
          id: postResponse.body.data.id,
        },
      };

      expect(postResponse.statusCode).toBe(200);
      expect(getResponse.status).toBe(200);
      expect(getResponse.body.data).toMatchObject(returnedPage);
    });
  });
});
