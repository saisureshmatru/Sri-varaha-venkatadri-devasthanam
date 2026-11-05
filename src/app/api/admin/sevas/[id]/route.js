import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, title_te, slug, description, description_te, amount, is_public } = body;

    const res = await query(
      `UPDATE sevas SET title = $1, title_te = $2, slug = $3, description = $4, description_te = $5, amount = $6, is_public = $7 
       WHERE id = $8 AND deleted_at IS NULL RETURNING *`,
      [title, title_te, slug, description, description_te, amount, is_public, id]
    );

    if (res.rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ message: 'Seva updated successfully', seva: res.rows[0] });
  } catch (error) {
    console.error('Failed to update seva:', error);
    return NextResponse.json({ error: 'Failed to update seva' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    
    // Soft delete via is_public
    const res = await query(
      `UPDATE sevas SET is_public = false WHERE id = $1 RETURNING id`,
      [id]
    );

    if (res.rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ message: 'Seva deleted successfully' });
  } catch (error) {
    console.error('Failed to delete seva:', error);
    return NextResponse.json({ error: 'Failed to delete seva' }, { status: 500 });
  }
}
