import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'

@Injectable()
export class StatisticsService {
	constructor(private prisma: PrismaService) {}

	async getMain() {
		const ordersCount = this.prisma.order.count()
		const reviewsCount = this.prisma.review.count()
		const usersCount = this.prisma.user.count()
		const totalAmount = await this.prisma.order.aggregate({
			_sum: {
				total: true
			}
		})

		return [
			{
				name: 'Orders',
				value: ordersCount
			},
			{
				name: 'Reviews',
				value: reviewsCount
			},
			{
				name: 'Users',
				value: usersCount
			},
			{
				name: 'Total amount',
				value: totalAmount._sum.total
			}
		]
	}
}
