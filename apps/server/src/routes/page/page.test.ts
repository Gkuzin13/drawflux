import type {
  NodeObject,
  SharePageParams,
  SharedPage,
  StageConfig,
} from 'shared';
import request from 'supertest';
import app from '../../app';

const mockNode: NodeObject = {
  nodeProps: { id: 'node-id', point: [0, 0], rotation: 0, visible: true },
  style: { size: 8, animated: false, color: '#000000', line: [0, 12] },
  type: 'arrow',
  text: null,
};

const mockStageConfig: StageConfig = { position: { x: 0, y: 0 }, scale: 1 };

describe('POST /p', () => {
  it('should return the page', async () => {
    const mockPage: SharePageParams = {
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

describe('GET /p', () => {
  it('should return the page', async () => {
    const mockPage: SharePageParams = {
      page: {
        stageConfig: mockStageConfig,
        nodes: [mockNode],
      },
    };

    const postResponse = await request(app).post('/p').send(mockPage);
    const getResponse = await request(app)
      .get(`/p/${postResponse.body.data.id}`)
      .send();

    const returnedPage: SharedPage = {
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
