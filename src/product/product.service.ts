import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import slug from 'slug';
import { PaginationService } from 'src/pagination/pagination.service';
import { PrismaService } from 'src/prisma.service';
import { EnumProductSort, GetAllProductDto } from './dto/get-all.product.dto';
import { ProductDto } from './dto/product.dto';
import {
  productReturnObject,
  productReturnObjectFullest,
} from './return-product.object';

@Injectable()
export class ProductService {
  constructor(
    private prisma: PrismaService,
    private paginationService: PaginationService,
  ) {}

  async getAll(dto: GetAllProductDto = {}) {
    const { sort, searchTerm } = dto;

    const prismaSort: Prisma.ProductOrderByWithRelationInput[] = [];

    if (sort === EnumProductSort.LOW_PRICE) 
      prismaSort.push({ price: 'asc' });
    else if (sort === EnumProductSort.HIGH_PRICE)
      prismaSort.push({ price: 'desc' });
    else if (sort === EnumProductSort.OLDEST)
      prismaSort.push({ createAt: 'asc' });
    else if (sort === EnumProductSort.NEWEST)
      prismaSort.push({ createAt: 'desc' });

    const prismaSearchTermFilter: Prisma.ProductWhereInput = searchTerm
      ? {
          OR: [
              { category: {
                name: {
                  contains: searchTerm,
                  mode: 'insensitive',
                },
              } },
              { name: {
                contains: searchTerm,
                mode: 'insensitive',
              } },
              { description: {
                contains: searchTerm,
                mode: 'insensitive',
              } },
            
          ],
        }
      : {};

    const { perPage, skip } = this.paginationService.getPagination(dto);

    const products = await this.prisma.product.findMany({
      where: prismaSearchTermFilter,
      orderBy: prismaSort,
      skip,
      take: perPage,
      select: productReturnObject,
    });

    return {
      products,
      length: await this.prisma.product.count({
        where: prismaSearchTermFilter,
      }),
    };
  }

  async byId(id: number) {
    const product = await this.prisma.product.findUnique({
      where: {
        id,
      },
      select: productReturnObjectFullest,
    });

    if (!product) {
      throw new Error('Product not found');
    }

    return product;
  }

  async bySlug(slug: string) {
    const products = await this.prisma.product.findUnique({
      where: {
        slug,
      },
      select: productReturnObjectFullest,
    });

    if (!products) {
      throw new NotFoundException('Products not found');
    }

    return products;
  }

  async byCategory(categorySlug: string) {
    const products = await this.prisma.product.findMany({
      where: {
        category: {
          slug: categorySlug,
        },
      },
      select: productReturnObjectFullest,
    });

    if (!products) {
      throw new NotFoundException('Products not found');
    }

    return products;
  }

  async getSimilar(id: number) {
    const currentProduct = await this.byId(id);

    if (!currentProduct) {
      throw new NotFoundException('Current product not found!');
    }

    const products = await this.prisma.product.findMany({
      where: {
        category: {
          name: currentProduct.name,
        },
        NOT: {
          id: currentProduct.id,
        },
      },
      orderBy: {
        createAt: 'desc',
      },
      select: productReturnObject,
    });

    return products;
  }

  // TODO do create method
  // async create() {
  //   return this.prisma.product.create({
  //     data: {
  //       name: "",
  //       description: "",
  //       images: [],
  //       price: 0
  //     },
  //   });
  // }

  async update(id: number, dto: ProductDto) {
    const { description, images, price, name, categoryId } = dto;

    return this.prisma.product.update({
      where: {
        id,
      },
      data: {
        description,
        images,
        price,
        name,
        slug: slug(name),
        category: {
          connect: {
            id: categoryId,
          },
        },
      },
    });
  }

  async delete(id: number) {
    return this.prisma.product.delete({
      where: {
        id,
      },
    });
  }
}
