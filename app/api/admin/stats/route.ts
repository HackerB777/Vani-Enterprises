import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/mongodb';
import { Product } from '@/lib/models/Product';
import { OrderModel } from '@/lib/models/Order';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const today    = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const [
      totalOrders,
      todayOrders,
      pendingOrders,
      deliveredOrders,
      totalProducts,
      lowStockProducts,
      revenueAgg,
      todayRevenueAgg,
    ] = await Promise.all([
      OrderModel.countDocuments(),
      OrderModel.countDocuments({ createdAt: { $gte: today.toISOString(), $lt: tomorrow.toISOString() } }),
      OrderModel.countDocuments({ status: { $in: ['placed', 'confirmed', 'processing'] } }),
      OrderModel.countDocuments({ status: 'delivered' }),
      Product.countDocuments(),
      Product.countDocuments({ stock: { $lt: 10, $gt: -1 } }),
      OrderModel.aggregate([{ $group: { _id: null, total: { $sum: '$total' } } }]),
      OrderModel.aggregate([
        { $match: { createdAt: { $gte: today.toISOString(), $lt: tomorrow.toISOString() } } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),
    ]);

    return NextResponse.json({
      totalOrders,
      todayOrders,
      pendingOrders,
      deliveredOrders,
      totalProducts,
      lowStockCount: lowStockProducts,
      totalRevenue:  revenueAgg[0]?.total ?? 0,
      todayRevenue:  todayRevenueAgg[0]?.total ?? 0,
    });
  } catch (err) {
    console.error('GET /api/admin/stats:', err);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
