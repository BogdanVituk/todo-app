import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { MailService } from '../mail/mail.service';
import { v4 as uuidv4 } from 'uuid';
import { SHARED_LIST_EXPIRY_DAYS, DEFAULT_PAGE, DEFAULT_LIMIT } from '../config/constants';
import { UpdateTaskDto } from './dto/update-tast.dto';

@Injectable()
export class TasksService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  async getAll(userId: number, page: number = DEFAULT_PAGE, limit: number = DEFAULT_LIMIT) {
    const skip = (page - 1) * limit;

    const [todos, totalItems] = await Promise.all([
      this.prisma.task.findMany({
        where: { userId },
        skip: skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.task.count({ where: { userId } }),
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    return {
      data: todos,
      meta: {
        totalItems,
        itemCount: todos.length,
        itemsPerPage: Number(limit),
        totalPages,
        currentPage: Number(page),
      },
    };
  }

  async create(data: CreateTaskDto, userId: number) {
    return this.prisma.task.create({   data: {
      title: data.title,
      description: data.description,
      priority: data.priority,
      deadline: data.deadline ? new Date(data.deadline) : null,
      userId,
    },
  });
  }

  async update(id: number, data: UpdateTaskDto) {
  await this.findTaskOrThrow(id);

  return this.prisma.task.update({
    where: { id },
    data: {
      ...(data.title && { title: data.title }),
      ...(data.description && { description: data.description }),
      ...(data.priority && { priority: data.priority }),
      deadline: data.deadline ? new Date(data.deadline) : null,
    },
  });
}

  private async findTaskOrThrow(id: number) {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) {
      throw new NotFoundException(`Task with id=${id} not found`);
    }
    return task;
  }

  async delete(id: number) {
    await this.findTaskOrThrow(id);
    return this.prisma.task.delete({ where: { id } });
  }

  async updateStatus(id: number, data: UpdateTaskStatusDto) {
    await this.findTaskOrThrow(id);

    return this.prisma.task.update({
      where: { id },
      data: { completed: data.completed },
    });
  }

  async shareTodos(recipientEmail: string, baseUrl: string, userId: number) {
    const token = uuidv4();
    const tasks = await this.prisma.task.findMany({ where: { userId } });
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + SHARED_LIST_EXPIRY_DAYS);

    const sharedList = await this.prisma.sharedList.create({
      data: {
        token,
        recipientEmail,
        tasksData: JSON.stringify(tasks),
        expiresAt,
        userId,
      },
    });

    const shareLink = `${baseUrl}/shared/${token}`;
    await this.mailService.sendShareLink(recipientEmail, shareLink);

    return sharedList;
  }

  async getSharedList(token: string) {
    const sharedList = await this.prisma.sharedList.findUnique({
      where: { token },
    });

    if (!sharedList) {
      throw new NotFoundException('Shared list not found');
    }

    if (new Date() > sharedList.expiresAt) {
      throw new NotFoundException('Shared list has expired');
    }

    return JSON.parse(sharedList.tasksData);
  }
}
