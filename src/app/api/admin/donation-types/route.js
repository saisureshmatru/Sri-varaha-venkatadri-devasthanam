import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 0;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const offset = page * limit;

    const countRes = await query('SELECT COUNT(*) FROM donation_types');
    const res = await query('SELECT * FROM donation_types ORDER BY id ASC LIMIT $1 OFFSET $2', [limit, offset]);
    
    return NextResponse.json({
      data: res.rows,
      total: parseInt(countRes.rows[0].count, 10)
    });
  } catch (error) {
    console.error('Error fetching donation types:', error);
    return NextResponse.json({ error: 'Failed to fetch donation types' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { name_en, name_te, is_active } = body;

    if (!name_en || !name_te) {
      return NextResponse.json({ error: 'English and Telugu names are required' }, { status: 400 });
    }

    const res = await query(
      'INSERT INTO donation_types (name_en, name_te, is_active) VALUES ($1, $2, $3) RETURNING *',
      [name_en, name_te, is_active ?? true]
    );

    return NextResponse.json(res.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error creating donation type:', error);
    return NextResponse.json({ error: 'Failed to create donation type' }, { status: 500 });
  }
}
