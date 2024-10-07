import { Module } from '@nestjs/common'
import { CategoryModule } from 'src/category/category.module'
import { PaginationModule } from 'src/pagination/pagination.module'
import { PrismaService } from 'src/prisma.service'
import { ProductModule } from 'src/product/product.module'
import { ProductService } from 'src/product/product.service'
import { ReviewController } from './review.controller'
import { ReviewService } from './review.service'

@Module({
	controllers: [ReviewController],
	providers: [ReviewService, PrismaService, ProductService],
	imports: [ProductModule, PaginationModule, CategoryModule]
})
export class ReviewModule {}
