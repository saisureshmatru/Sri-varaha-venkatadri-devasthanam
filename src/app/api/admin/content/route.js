import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const res = await query('SELECT key, value_en, value_te FROM site_content ORDER BY key ASC');
    return NextResponse.json(res.rows);
  } catch (error) {
    console.error('Error fetching admin site content:', error);
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { key, value_en, value_te } = body;

    if (!key) {
      return NextResponse.json({ error: 'Missing key' }, { status: 400 });
    }

    const updateQuery = `
      INSERT INTO site_content (key, value_en, value_te, updated_at)
      VALUES ($1, $2, $3, NOW())
      ON CONFLICT (key) DO UPDATE SET 
        value_en = EXCLUDED.value_en,
        value_te = EXCLUDED.value_te,
        updated_at = NOW()
      RETURNING *
    `;
    const res = await query(updateQuery, [key, value_en, value_te]);
    
    return NextResponse.json(res.rows[0]);
  } catch (error) {
    console.error('Error updating site content:', error);
    return NextResponse.json({ error: 'Failed to update content' }, { status: 500 });
  }
}
