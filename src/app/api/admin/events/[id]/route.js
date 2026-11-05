import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, title_te, description, description_te, event_date, type, image_url } = body;

    const res = await query(
      `UPDATE events SET title = $1, title_te = $2, description = $3, description_te = $4, event_date = $5, type = $6, image_url = $7 
       WHERE id = $8 AND deleted_at IS NULL RETURNING *`,
      [title, title_te, description, description_te, event_date, type, image_url, id]
    );

    if (res.rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ message: 'Event updated successfully', event: res.rows[0] });
  } catch (error) {
    console.error('Failed to update event:', error);
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    
    // Soft delete via is_active
    const res = await query(
      `UPDATE events SET is_active = false WHERE id = $1 RETURNING id`,
      [id]
    );

    if (res.rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Failed to delete event:', error);
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
  }
}
