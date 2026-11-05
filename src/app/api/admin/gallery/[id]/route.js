import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    if (body.restore_deleted) {
      const res = await query(
        `UPDATE gallery_items SET deleted_at = NULL WHERE id = $1 RETURNING *`,
        [id]
      );
      if (res.rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
      return NextResponse.json({ message: 'Gallery item restored successfully', item: res.rows[0] });
    }

    const { title, title_te, media_url, media_type } = body;

    const res = await query(
      `UPDATE gallery_items SET title = $1, title_te = $2, media_url = $3, media_type = $4
       WHERE id = $5 RETURNING *`,
      [title, title_te, media_url, media_type, id]
    );

    if (res.rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ message: 'Gallery item updated successfully', item: res.rows[0] });
  } catch (error) {
    console.error('Failed to update gallery item:', error);
    return NextResponse.json({ error: 'Failed to update gallery item' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    
    // Soft delete
    const res = await query(
      `UPDATE gallery_items SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING id`,
      [id]
    );

    if (res.rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ message: 'Gallery item deleted successfully' });
  } catch (error) {
    console.error('Failed to delete gallery item:', error);
    return NextResponse.json({ error: 'Failed to delete gallery item' }, { status: 500 });
  }
}
