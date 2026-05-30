import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    return this.prisma.task.findMany();
  }

  async create(data: CreateTaskDto) {
    return this.prisma.task.create({ data });
  }

  async delete(id: number) {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) {
      throw new NotFoundException(`Task with id=${id} not found`);
    }

    return this.prisma.task.delete({ where: { id } });
  }

  async updateStatus(id: number, data: UpdateTaskStatusDto) {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) {
      throw new NotFoundException(`Task with id=${id} not found`);
    }

    return this.prisma.task.update({
      where: { id },
      data: { completed: data.completed },
    });
  }
}
