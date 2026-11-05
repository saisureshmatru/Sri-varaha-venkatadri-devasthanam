import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '9', 10);
    const offset = (page - 1) * limit;

    // Fetch total count for pagination
    const countRes = await query(`SELECT COUNT(*) FROM donations WHERE payment_status = 'COMPLETED'`);
    const totalCount = parseInt(countRes.rows[0].count, 10);
    const totalPages = Math.ceil(totalCount / limit);

    // Fetch paginated records
    const sql = `
      SELECT id, donor_name, amount, type, created_at 
      FROM donations 
      WHERE payment_status = 'COMPLETED'
      ORDER BY created_at DESC 
      LIMIT $1 OFFSET $2
    `;
    const res = await query(sql, [limit, offset]);

    return NextResponse.json({
      data: res.rows,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages
      }
    });
  } catch (error) {
    console.error('Failed to fetch public donations:', error);
    return NextResponse.json({ error: 'Failed to fetch donations' }, { status: 500 });
  }
}
