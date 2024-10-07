import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	Param,
	Post,
	Put,
	Query,
	UsePipes,
	ValidationPipe
} from '@nestjs/common'
import { Auth } from 'src/auth/decorators/auth.decorator'
import { GetAllProductDto } from './dto/get-all.product.dto'
import { ProductDto } from './dto/product.dto'
import { ProductService } from './product.service'

@Controller('products')
export class ProductController {
	constructor(private readonly productService: ProductService) {}

	@UsePipes(new ValidationPipe())
	@Get()
	async getAll(@Query() queryDto: GetAllProductDto) {
		return this.productService.getAll(queryDto)
	}

	@Get('similar/:id')
	async getSimilar(@Param('id') id: string) {
		return this.productService.getSimilar(+id)
	}

	@Get(':id')
	@Auth('admin')
	async getById(@Param('id') id: string) {
		return this.productService.byId(+id)
	}

	@Get('by-slug/:slug')
	async getProductBySlug(@Param('slug') slug: string) {
		return this.productService.bySlug(slug)
	}

	@Get('by-category/:categorySlug')
	async getProductsByCategory(@Param('categorySlug') categorySlug: string) {
		return this.productService.byCategory(categorySlug)
	}

	@UsePipes(new ValidationPipe())
	@Post()
	@Auth('admin')
	@HttpCode(200)
	async createProduct() {
		return this.productService.create()
	}

	@UsePipes(new ValidationPipe())
	@Put(':id')
	@Auth('admin')
	@HttpCode(200)
	async updateProduct(@Param('id') id: string, @Body() dto: ProductDto) {
		return this.productService.update(+id, dto)
	}

	@UsePipes(new ValidationPipe())
	@Delete(':id')
	@Auth('admin')
	@HttpCode(200)
	async deleteProduct(@Param('id') id: string) {
		return this.productService.delete(+id)
	}
}
