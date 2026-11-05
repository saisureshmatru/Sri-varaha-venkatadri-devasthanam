import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const body = await req.json();
    const { name_en, name_te, is_active } = body;

    const res = await query(
      'UPDATE donation_types SET name_en = $1, name_te = $2, is_active = $3 WHERE id = $4 RETURNING *',
      [name_en, name_te, is_active, id]
    );

    if (res.rowCount === 0) {
      return NextResponse.json({ error: 'Donation type not found' }, { status: 404 });
    }

    return NextResponse.json(res.rows[0]);
  } catch (error) {
    console.error('Error updating donation type:', error);
    return NextResponse.json({ error: 'Failed to update donation type' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = params;
    const res = await query('UPDATE donation_types SET is_active = false WHERE id = $1 RETURNING *', [id]);

    if (res.rowCount === 0) {
      return NextResponse.json({ error: 'Donation type not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Deleted successfully' });
  } catch (error) {
    console.error('Error deleting donation type:', error);
    return NextResponse.json({ error: 'Failed to delete donation type' }, { status: 500 });
  }
}
