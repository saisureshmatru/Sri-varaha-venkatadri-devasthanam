import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 0;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const offset = page * limit;

    const countRes = await query('SELECT COUNT(*) FROM sevas');
    const dataRes = await query(
      'SELECT id, slug, title, title_te, description, description_te, amount, is_public FROM sevas ORDER BY id ASC LIMIT $1 OFFSET $2',
      [limit, offset]
    );

    return NextResponse.json({
      data: dataRes.rows,
      total: parseInt(countRes.rows[0].count, 10)
    });
  } catch (error) {
    console.error('Failed to fetch sevas:', error);
    return NextResponse.json({ error: 'Failed to fetch sevas' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, title_te, slug, description, description_te, amount, is_public } = body;

    const res = await query(
      `INSERT INTO sevas (title, title_te, slug, description, description_te, amount, is_public) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [title, title_te, slug, description, description_te, amount, is_public]
    );

    return NextResponse.json({ message: 'Seva created successfully', seva: res.rows[0] });
  } catch (error) {
    console.error('Failed to create seva:', error);
    return NextResponse.json({ error: 'Failed to create seva' }, { status: 500 });
  }
}
