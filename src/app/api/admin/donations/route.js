import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 0;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const search = searchParams.get('search') || '';
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const offset = page * limit;

    let dataQuery = `SELECT * FROM donations`;
    let countQuery = `SELECT COUNT(*) FROM donations`;
    let queryParams = [];
    let whereClauses = [];

    if (search) {
      whereClauses.push(`(donor_name ILIKE $${queryParams.length + 1} OR donor_email ILIKE $${queryParams.length + 1})`);
      queryParams.push(`%${search}%`);
    }
    
    if (startDate) {
      whereClauses.push(`created_at >= $${queryParams.length + 1}`);
      queryParams.push(`${startDate} 00:00:00`);
    }

    if (endDate) {
      whereClauses.push(`created_at <= $${queryParams.length + 1}`);
      queryParams.push(`${endDate} 23:59:59`);
    }

    if (whereClauses.length > 0) {
      const whereString = ' WHERE ' + whereClauses.join(' AND ');
      dataQuery += whereString;
      countQuery += whereString;
    }

    dataQuery += ` ORDER BY created_at DESC LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
    
    const [dataRes, countRes] = await Promise.all([
      query(dataQuery, [...queryParams, limit, offset]),
      query(countQuery, queryParams)
    ]);

    return NextResponse.json({
      data: dataRes.rows,
      total: parseInt(countRes.rows[0].count, 10)
    });
  } catch (error) {
    console.error('Failed to fetch donations:', error);
    return NextResponse.json({ error: 'Failed to fetch donations' }, { status: 500 });
  }
}
