import { NextRequest, NextResponse } from 'next/server';
import { Product } from '@/models/Product';
import { Category } from '@/models/Category'; // Import Category model
import connectDB from '@/lib/database';
import mongoose from 'mongoose';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const search = searchParams.get('search') || '';
    const categorySlugs =
      searchParams.get('categories')?.split(',').filter(Boolean) || [];
    const brands = searchParams.get('brands')?.split(',').filter(Boolean) || [];
    const minPrice = parseFloat(searchParams.get('minPrice') || '0');
    const maxPrice = parseFloat(searchParams.get('maxPrice') || '1000');
    const sortBy = searchParams.get('sort') || 'featured';
    const featured = searchParams.get('featured');
    const active = searchParams.get('active') || 'true';

    // Build query
    const query: any = {};

    // Active products filter
    if (active !== 'all') {
      query.active = active === 'true';
    }

    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Category filter by slug
    if (categorySlugs.length > 0) {
      // Find category IDs based on slugs
      const categories = await Category.find({
        slug: { $in: categorySlugs }
      }).select('_id');

      const categoryIds = categories.map((cat) => cat._id);

      if (categoryIds.length > 0) {
        query.categoryId = { $in: categoryIds };
      }
    }

    // Brand filter
    if (brands.length > 0) {
      query.brand = { $in: brands };
    }

    // Price range filter
    query.price = { $gte: minPrice, $lte: maxPrice };

    // Featured filter
    if (featured !== null && featured !== 'all') {
      query.featured = featured === 'true';
    }

    const skip = (page - 1) * limit;

    // Build sort object
    let sortOptions: any = {};
    switch (sortBy) {
      case 'price-asc':
        sortOptions = { price: 1 };
        break;
      case 'price-desc':
        sortOptions = { price: -1 };
        break;
      case 'newest':
        sortOptions = { createdAt: -1 };
        break;
      case 'best-selling':
        sortOptions = { salesCount: -1 };
        break;
      case 'rating':
        sortOptions = { rating: -1 };
        break;
      case 'featured':
      default:
        sortOptions = { featured: -1, createdAt: -1 };
        break;
    }

    // Get products with pagination and populate category
    const products = await Product.find(query)
      .populate('categoryId', 'name slug')
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .select('-__v');

    // Get total count for pagination
    const total = await Product.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    // Get categories and brands for filters
    const allCategories = await Category.find({ active: true })
      .select('name slug')
      .sort({ name: 1 });

    const allBrands = await Product.distinct('brand', { active: true });

    // Calculate actual price range
    const priceStats = await Product.aggregate([
      { $match: { active: true } },
      {
        $group: {
          _id: null,
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      }
    ]);

    const priceRange = priceStats[0] || { minPrice: 0, maxPrice: 1000 };

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      filters: {
        categories: allCategories,
        brands: allBrands,
        priceRange: {
          min: priceRange.minPrice,
          max: priceRange.maxPrice
        }
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
