import {
	Body,
	Controller,
	Get,
	HttpCode,
	Post,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { CurrentUser } from 'src/auth/decorators/user.decorator'
import { OrderDto } from './order.dto'
import { OrderService } from './order.service'
import { PaymentStatusDto } from './payment-status.dto'

@Controller('orders')
export class OrderController {
	constructor(private readonly orderService: OrderService) {}

	@Get()
	@Auth('admin')
	getAll() {
		return this.orderService.getAll()
	}

	@Get('/by-user')
	@Auth()
	getByUserId(@CurrentUser('id') userId: number) {
		return this.orderService.getByUserId(userId)
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post()
	@Auth()
	placeHolder(@Body() dto: OrderDto, @CurrentUser('id') userId: number) {
		return this.orderService.placeOrder(dto, userId)
	}

	@HttpCode(200)
	@Post()
	async updateStatus(@Body() dto: PaymentStatusDto) {
		return this.orderService.updateStatus(dto)
	}
}
