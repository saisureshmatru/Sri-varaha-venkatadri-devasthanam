import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 0;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const offset = page * limit;

    const countRes = await query('SELECT COUNT(*) FROM cms_pages WHERE deleted_at IS NULL');
    const dataRes = await query(
      'SELECT id, slug, title, title_te, content, content_te, is_public FROM cms_pages WHERE deleted_at IS NULL ORDER BY id ASC LIMIT $1 OFFSET $2',
      [limit, offset]
    );

    return NextResponse.json({
      data: dataRes.rows,
      total: parseInt(countRes.rows[0].count, 10)
    });
  } catch (error) {
    console.error('Failed to fetch CMS pages:', error);
    return NextResponse.json({ error: 'Failed to fetch CMS pages' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { title, title_te, slug, content, content_te, is_public } = body;

    const res = await query(
      `INSERT INTO cms_pages (title, title_te, slug, content, content_te, is_public) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [title, title_te, slug, content, content_te, is_public]
    );

    return NextResponse.json({ message: 'Page created successfully', page: res.rows[0] });
  } catch (error) {
    console.error('Failed to create page:', error);
    return NextResponse.json({ error: 'Failed to create page' }, { status: 500 });
  }
}
