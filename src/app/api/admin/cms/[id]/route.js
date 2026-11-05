import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, title_te, slug, content, content_te, is_public } = body;

    const res = await query(
      `UPDATE cms_pages SET title = $1, title_te = $2, slug = $3, content = $4, content_te = $5, is_public = $6 
       WHERE id = $7 AND deleted_at IS NULL RETURNING *`,
      [title, title_te, slug, content, content_te, is_public, id]
    );

    if (res.rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ message: 'CMS page updated successfully', page: res.rows[0] });
  } catch (error) {
    console.error('Failed to update CMS page:', error);
    return NextResponse.json({ error: 'Failed to update CMS page' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    
    // Soft delete
    const res = await query(
      `UPDATE cms_pages SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING id`,
      [id]
    );

    if (res.rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ message: 'CMS page deleted successfully' });
  } catch (error) {
    console.error('Failed to delete CMS page:', error);
    return NextResponse.json({ error: 'Failed to delete CMS page' }, { status: 500 });
  }
}
