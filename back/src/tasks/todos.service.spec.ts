import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { PrismaService } from '../prisma/prisma.service';

describe('TasksService', () => {
  let service: TasksService;
  let prisma: PrismaService;

  const mockPrismaService = {
    task: {
      create: jest.fn().mockImplementation((args) =>
        Promise.resolve({ id: 1, completed: false, ...args.data }),
      ),
      findMany: jest.fn().mockResolvedValue([
        { id: 1, title: 'Test Task', description: 'This is a test task', completed: false },
      ]),
      findUnique: jest.fn().mockResolvedValue({
        id: 1,
        title: 'Test Task',
        description: 'This is a test task',
        completed: false,
      }),
      delete: jest.fn().mockResolvedValue({
        id: 1,
        title: 'Test Task',
        description: 'This is a test task',
        completed: false,
      }),
      update: jest.fn().mockResolvedValue({
        id: 1,
        title: 'Test Task',
        description: 'This is a test task',
        completed: true,
      }),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new task', async () => {
      const dto = { title: 'Test Task', description: 'This is a test task' };
      const result = await service.create(dto);

      expect(result).toHaveProperty('id');
      expect(result.title).toBe(dto.title);
      expect(result.description).toBe(dto.description);
      expect(prisma.task.create).toHaveBeenCalledWith({ data: dto });
    });
  });

  describe('getAll', () => {
    it('should return an array of tasks', async () => {
      const todos = await service.getAll();

      expect(Array.isArray(todos)).toBe(true);
      expect(todos.length).toBeGreaterThan(0);
      expect(prisma.task.findMany).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete a task when it exists', async () => {
      const result = await service.delete(1);

      expect(prisma.task.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(prisma.task.delete).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toHaveProperty('id', 1);
    });
  });

  describe('updateStatus', () => {
    it('should update task completed status', async () => {
      const result = await service.updateStatus(1, { completed: true });

      expect(prisma.task.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(prisma.task.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { completed: true },
      });
      expect(result.completed).toBe(true);
    });
  });
});
