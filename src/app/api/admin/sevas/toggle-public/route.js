import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request) {
  try {
    const { id, isPublic } = await request.json();

    if (!id || typeof isPublic !== 'boolean') {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    await query('UPDATE sevas SET is_public = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2', [isPublic, id]);

    return NextResponse.json({ message: 'Seva visibility updated successfully' });
  } catch (error) {
    console.error('Failed to update seva visibility:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
