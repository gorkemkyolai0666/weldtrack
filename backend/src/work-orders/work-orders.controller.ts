import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { WorkOrdersService } from './work-orders.service';
import { CreateWorkOrderDto } from './dto/create-work-order.dto';
import { UpdateWorkOrderDto } from './dto/update-work-order.dto';

@Controller('work-orders')
@UseGuards(AuthGuard('jwt'))
export class WorkOrdersController {
  constructor(private workOrdersService: WorkOrdersService) {}

  @Get()
  findAll(
    @Query('status') status?: string,
    @Query('priority') priority?: string,
    @Query('search') search?: string,
  ) {
    return this.workOrdersService.findAll(status, priority, search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.workOrdersService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateWorkOrderDto, @Request() req) {
    return this.workOrdersService.create(dto, req.user.sub);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateWorkOrderDto) {
    return this.workOrdersService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.workOrdersService.remove(id);
  }

  @Post(':id/quality-checks')
  addQualityCheck(
    @Param('id') id: string,
    @Body() data: { checkType: string; result?: string; notes?: string; inspectedBy?: string },
  ) {
    return this.workOrdersService.addQualityCheck(id, data);
  }
}
