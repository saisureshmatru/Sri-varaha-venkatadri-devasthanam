import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const res = await query("SELECT * FROM gallery_items WHERE deleted_at IS NULL ORDER BY created_at DESC");
    return NextResponse.json(res.rows);
  } catch (error) {
    console.error('Failed to fetch public gallery items:', error);
    return NextResponse.json([], { status: 500 });
  }
}
