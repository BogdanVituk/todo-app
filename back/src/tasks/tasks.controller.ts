import { Body, Controller, Delete, Get, Param, Patch, Post, ParseIntPipe, Req, UseGuards, InternalServerErrorException, Query } from '@nestjs/common';
import { Request } from 'express';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { GetUser, JwtAuthGuard, UserPayload } from 'src/guards/jwt-auth.guard';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) { }

  @Get()
  @UseGuards(JwtAuthGuard)
  getAll(
    @GetUser() user: UserPayload,
    @Query('page', ParseIntPipe) page?: number,
    @Query('limit', ParseIntPipe) limit?: number,
  ) {
    return this.tasksService.getAll(user.id, page, limit);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() data: CreateTaskDto,
    @GetUser() user: UserPayload,
  ) {
    return this.tasksService.create(data, user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.delete(id);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard)
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateTaskStatusDto,
  ) {
    return this.tasksService.updateStatus(id, data);
  }

  @Post('share')
  @UseGuards(JwtAuthGuard)
  share(
    @GetUser() user: UserPayload,
    @Body('email') targetEmail: string,
    @Req() request: Request,
  ) {
    if (!targetEmail) {
      throw new InternalServerErrorException('Email отримувача є обов\'язковим полем');
    }
    const baseUrl = process.env.FRONTEND_URL || `${request.protocol}://${request.get('host')}`;
    return this.tasksService.shareTodos(targetEmail, baseUrl, user.id);
  }

  @Get('shared/:token')
  getSharedList(@Param('token') token: string) {
    return this.tasksService.getSharedList(token);
  }
}
