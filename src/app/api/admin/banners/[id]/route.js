import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const body = await req.json();
    
    // Allow partial updates for is_active
    if ('is_active' in body) {
      await query('UPDATE home_banners SET is_active = $1 WHERE id = $2', [body.is_active, id]);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating banner:', error);
    return NextResponse.json({ error: 'Failed to update banner' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const id = params.id;
    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    await query('UPDATE home_banners SET is_active = false WHERE id = $1', [id]);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting banner:', error);
    return NextResponse.json({ error: 'Failed to delete banner' }, { status: 500 });
  }
}
