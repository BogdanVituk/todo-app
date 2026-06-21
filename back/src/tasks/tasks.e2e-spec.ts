import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from 'src/app.module';
import { PrismaService } from '../prisma/prisma.service';

describe('Tasks e2e', () => {
    let app: INestApplication;
    let prisma: PrismaService;
    let authToken: string;
    const email = `e2e-${Date.now()}@example.com`;
    const password = 'password123';
    let taskId: number;

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleRef.createNestApplication();
        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
                forbidNonWhitelisted: true,
                transform: true,
            }),
        );
        await app.init();

        prisma = app.get(PrismaService);
    }, 30000);

    afterAll(async () => {
        if (prisma) {
            await prisma.user.deleteMany({ where: { email } });
            await prisma.$disconnect();
        }
        if (app) {
            await app.close();
        }
    });

    it('should register and login a user, then perform task CRUD', async () => {
        const registerResponse = await request(app.getHttpServer())
            .post('/auth/register')
            .send({ email, password })
            .expect(201);

        expect(registerResponse.body).toHaveProperty('accessToken');
        expect(typeof registerResponse.body.accessToken).toBe('string');

        const loginResponse = await request(app.getHttpServer())
            .post('/auth/login')
            .send({ email, password })
            .expect(200);

        expect(loginResponse.body).toHaveProperty('accessToken');
        authToken = loginResponse.body.accessToken;

        const createResponse = await request(app.getHttpServer())
            .post('/tasks')
            .set('Authorization', `Bearer ${authToken}`)
            .send({ title: 'E2E Task', description: 'E2E description' })
            .expect(201);

        expect(createResponse.body).toHaveProperty('id');
        expect(createResponse.body.title).toBe('E2E Task');
        expect(createResponse.body.description).toBe('E2E description');
        taskId = createResponse.body.id;

        const listResponse = await request(app.getHttpServer())
            .get('/tasks')
            .set('Authorization', `Bearer ${authToken}`)
            .query({ page: 1, limit: 5 })
            .expect(200);

        expect(listResponse.body).toHaveProperty('data');
        expect(Array.isArray(listResponse.body.data)).toBe(true);
        expect(listResponse.body.data.some((task) => task.id === taskId)).toBe(true);

        const updateResponse = await request(app.getHttpServer())
            .patch(`/tasks/${taskId}/status`)
            .set('Authorization', `Bearer ${authToken}`)
            .send({ completed: true })
            .expect(200);

        expect(updateResponse.body.completed).toBe(true);
        expect(updateResponse.body.id).toBe(taskId);

        const deleteResponse = await request(app.getHttpServer())
            .delete(`/tasks/${taskId}`)
            .set('Authorization', `Bearer ${authToken}`)
            .expect(200);

        expect(deleteResponse.body.id).toBe(taskId);
    }, 60000);
});
