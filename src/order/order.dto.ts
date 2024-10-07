import { EnumOrderStatus } from '@prisma/client'
import { Type } from 'class-transformer'
import {
	IsArray,
	IsEnum,
	IsNumber,
	IsOptional,
	ValidateNested
} from 'class-validator'

export class OrderDto {
	@IsOptional()
	@IsEnum(EnumOrderStatus)
	status: EnumOrderStatus

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => OrderItemDto)
	items: OrderItemDto[]
}

export class OrderItemDto {
	@IsNumber()
	price: number

	@IsNumber()
	quantity: number

	@IsNumber()
	productId: number
}
