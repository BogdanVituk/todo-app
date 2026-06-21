import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { NotFoundException } from '@nestjs/common';

describe('TasksService', () => {
    let service: TasksService;
    let prisma: PrismaService;
    let mailService: MailService;

    const mockTask = {
        id: 1,
        title: 'Test Task',
        description: 'This is a test task',
        completed: false,
    };

    const mockPrismaService = {
        task: {
            create: jest.fn().mockImplementation((args) =>
                Promise.resolve({ id: 1, completed: false, ...args.data }),
            ),
            findMany: jest.fn().mockResolvedValue([mockTask]),
            count: jest.fn().mockResolvedValue(1),
            findUnique: jest.fn().mockResolvedValue(mockTask),
            delete: jest.fn().mockResolvedValue(mockTask),
            update: jest.fn().mockResolvedValue({
                ...mockTask,
                completed: true,
            }),
        },
        sharedList: {
            create: jest.fn().mockImplementation((args) =>
                Promise.resolve({
                    id: 1,
                    token: 'mock-token-123',
                    recipientEmail: args.data.recipientEmail,
                    tasksData: args.data.tasksData,
                    createdAt: new Date(),
                    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                }),
            ),
            findUnique: jest.fn().mockResolvedValue({
                id: 1,
                token: 'mock-token-123',
                recipientEmail: 'test@example.com',
                tasksData: JSON.stringify([mockTask]),
                createdAt: new Date(),
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            }),
        },
    };

    const mockMailService = {
        sendShareLink: jest.fn().mockResolvedValue({}),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TasksService,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
                {
                    provide: MailService,
                    useValue: mockMailService,
                },
            ],
        }).compile();

        service = module.get<TasksService>(TasksService);
        prisma = module.get<PrismaService>(PrismaService);
        mailService = module.get<MailService>(MailService);
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a new task', async () => {
            const dto = { title: 'Test Task', description: 'This is a test task' };
            const result = await service.create(dto, 1);

            expect(result).toHaveProperty('id');
            expect(result.title).toBe(dto.title);
            expect(result.description).toBe(dto.description);
            expect(result.userId).toBe(1);
            expect(prisma.task.create).toHaveBeenCalledWith({ data: { ...dto, userId: 1 } });
        });
    });

    describe('getAll', () => {
        it('should return paginated tasks', async () => {
            const result = await service.getAll(1, 1, 5);

            expect(result).toHaveProperty('data');
            expect(result).toHaveProperty('meta');
            expect(Array.isArray(result.data)).toBe(true);
            expect(result.data[0]).toHaveProperty('id');
            expect(result.data[0]).toHaveProperty('title');
            expect(result.meta.currentPage).toBe(1);
            expect(result.meta.itemsPerPage).toBe(5);
            expect(prisma.task.findMany).toHaveBeenCalledWith({
                where: { userId: 1 },
                skip: 0,
                take: 5,
                orderBy: { createdAt: 'desc' },
            });
            expect(prisma.task.count).toHaveBeenCalledWith({ where: { userId: 1 } });
        });
    });

    describe('delete', () => {
        it('should delete a task by id', async () => {
            const result = await service.delete(1);

            expect(result).toHaveProperty('id');
            expect(prisma.task.delete).toHaveBeenCalledWith({ where: { id: 1 } });
        });

        it('should throw NotFoundException if task does not exist', async () => {
            jest.spyOn(prisma.task, 'findUnique').mockResolvedValueOnce(null);

            await expect(service.delete(999)).rejects.toThrow(NotFoundException);
        });
    });

    describe('updateStatus', () => {
        it('should update task status', async () => {
            const result = await service.updateStatus(1, { completed: true });

            expect(result.completed).toBe(true);
            expect(prisma.task.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: { completed: true },
            });
        });

        it('should throw NotFoundException if task does not exist', async () => {
            jest.spyOn(prisma.task, 'findUnique').mockResolvedValueOnce(null);

            await expect(service.updateStatus(999, { completed: true })).rejects.toThrow(
                NotFoundException,
            );
        });
    });

    describe('shareTodos', () => {
        it('should create a shared list and send email', async () => {
            const email = 'recipient@example.com';
            const baseUrl = 'http://localhost:3000';

            const result = await service.shareTodos(email, baseUrl, 1);

            expect(result).toHaveProperty('token');
            expect(result.recipientEmail).toBe(email);
            expect(prisma.task.findMany).toHaveBeenCalledWith({ where: { userId: 1 } });
            expect(prisma.sharedList.create).toHaveBeenCalled();
            expect(mailService.sendShareLink).toHaveBeenCalledWith(
                email,
                expect.stringContaining('shared/'),
            );
        });

        it('should generate a valid share link', async () => {
            const email = 'test@example.com';
            const baseUrl = 'http://localhost:5173';

            await service.shareTodos(email, baseUrl, 1);

            const callArgs = mockMailService.sendShareLink.mock.calls[0];
            expect(callArgs[1]).toContain('http://localhost:5173/shared/');
        });
    });

    describe('getSharedList', () => {
        it('should return shared tasks by token', async () => {
            const result = await service.getSharedList('mock-token-123');

            expect(Array.isArray(result)).toBe(true);
            expect(result[0]).toHaveProperty('id');
            expect(prisma.sharedList.findUnique).toHaveBeenCalledWith({
                where: { token: 'mock-token-123' },
            });
        });

        it('should throw NotFoundException if token does not exist', async () => {
            jest.spyOn(prisma.sharedList, 'findUnique').mockResolvedValueOnce(null);

            await expect(service.getSharedList('invalid-token')).rejects.toThrow(
                NotFoundException,
            );
        });

        it('should throw NotFoundException if link has expired', async () => {
            const expiredDate = new Date(Date.now() - 1000); // 1 second ago
            jest.spyOn(prisma.sharedList, 'findUnique').mockResolvedValueOnce({
                id: 1,
                token: 'expired-token',
                recipientEmail: 'test@example.com',
                tasksData: JSON.stringify([mockTask]),
                createdAt: new Date(),
                expiresAt: expiredDate,
                userId: 1,
            });

            await expect(service.getSharedList('expired-token')).rejects.toThrow(
                NotFoundException,
            );
        });
    });
});
