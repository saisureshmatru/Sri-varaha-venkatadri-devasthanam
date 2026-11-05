import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 0;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const offset = page * limit;

    const countRes = await query('SELECT COUNT(*) FROM events');
    const dataRes = await query(
      'SELECT id, title, title_te, description, description_te, event_date, type, image_url, is_active FROM events ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );

    return NextResponse.json({
      data: dataRes.rows,
      total: parseInt(countRes.rows[0].count, 10)
    });
  } catch (error) {
    console.error('Failed to fetch events:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, title_te, description, description_te, event_date, type, image_url } = body;

    const res = await query(
      `INSERT INTO events (title, title_te, description, description_te, event_date, type, image_url) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [title, title_te, description, description_te, event_date, type, image_url]
    );

    return NextResponse.json({ message: 'Event created successfully', event: res.rows[0] });
  } catch (error) {
    console.error('Failed to create event:', error);
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}
