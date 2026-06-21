import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';

describe('TasksController', () => {
    let controller: TasksController;
    let service: TasksService;

    const mockTask = {
        id: 1,
        title: 'Test Task',
        description: 'This is a test task',
        completed: false,
    };

    const mockTasksService = {
        create: jest.fn().mockResolvedValue(mockTask),
        getAll: jest.fn().mockResolvedValue({
            data: [mockTask],
            meta: {
                totalItems: 1,
                itemCount: 1,
                itemsPerPage: 5,
                totalPages: 1,
                currentPage: 5,
            },
        }),
        delete: jest.fn().mockResolvedValue(mockTask),
        updateStatus: jest.fn().mockResolvedValue({ ...mockTask, completed: true }),
        shareTodos: jest.fn().mockImplementation((email, baseUrl, userId) =>
            Promise.resolve({
                id: 1,
                token: 'test-token-123',
                recipientEmail: email,
                baseUrl,
                userId,
                tasksData: JSON.stringify([mockTask]),
            })
        ),
        getSharedList: jest.fn().mockResolvedValue([mockTask]),
    };

    beforeEach(async () => {
   
        process.env.FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

        const module: TestingModule = await Test.createTestingModule({
            controllers: [TasksController],
            providers: [
                {
                    provide: TasksService,
                    useValue: mockTasksService,
                },
            ],
        }).compile();

        controller = module.get<TasksController>(TasksController);
        service = module.get<TasksService>(TasksService);
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('create', () => {
        it('should create a new task', async () => {
            const createTaskDto: CreateTaskDto = {
                title: 'New Task',
                description: 'New task description',
            };

            const result = await controller.create(createTaskDto, { id: 1 } as any);

            expect(result).toEqual(mockTask);
            expect(service.create).toHaveBeenCalledWith(createTaskDto, 1);
        });
    });

    describe('getAll', () => {
        it('should return paginated tasks', async () => {
            const result = await controller.getAll({ id: 1 } as any, 1, 5);

            expect(result).toHaveProperty('data');
            expect(Array.isArray(result.data)).toBe(true);
            expect(result.data[0]).toEqual(mockTask);
            expect(service.getAll).toHaveBeenCalledWith(1, 1, 5);
        });
    });

    describe('delete', () => {
        it('should delete a task by id', async () => {
            const result = await controller.delete(1);

            expect(result).toEqual(mockTask);
            expect(service.delete).toHaveBeenCalledWith(1);
        });
    });

    describe('updateStatus', () => {
        it('should update task status', async () => {
            const updateDto: UpdateTaskStatusDto = { completed: true };

            const result = await controller.updateStatus(1, updateDto);

            expect(result.completed).toBe(true);
            expect(service.updateStatus).toHaveBeenCalledWith(1, updateDto);
        });
    });

    describe('share', () => {
        it('should share todos and send email', async () => {
            const mockRequest = {
                protocol: 'http',
                get: jest.fn().mockReturnValue('localhost:3000'),
            } as any;

            const result = await controller.share(
                { id: 1 } as any,
                'recipient@example.com',
                mockRequest,
            );

            expect(result).toHaveProperty('token');
            expect(result.recipientEmail).toBe('recipient@example.com');
            expect(service.shareTodos).toHaveBeenCalledWith(
                'recipient@example.com',
                process.env.FRONTEND_URL,
                1,
            );
        });

        it('should construct correct share link base URL from env', async () => {
            const mockRequest = {
                protocol: 'https',
                get: jest.fn().mockReturnValue('example.com'),
            } as any;

            await controller.share(
                { id: 1 } as any,
                'test@example.com',
                mockRequest,
            );

            expect(service.shareTodos).toHaveBeenCalledWith(
                'test@example.com',
                process.env.FRONTEND_URL,
                1,
            );
        });
    });

    describe('getSharedList', () => {
        it('should return shared tasks by token', async () => {
            const result = await controller.getSharedList('test-token-123');

            expect(Array.isArray(result)).toBe(true);
            expect(result[0]).toEqual(mockTask);
            expect(service.getSharedList).toHaveBeenCalledWith('test-token-123');
        });

        it('should handle invalid token', async () => {
            service.getSharedList = jest.fn().mockRejectedValue(
                new Error('Shared list not found'),
            );

            await expect(controller.getSharedList('invalid-token')).rejects.toThrow(
                'Shared list not found',
            );
        });
    });
});
