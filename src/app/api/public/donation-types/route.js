import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Public API only fetches active donation types
    const res = await query('SELECT id, name_en, name_te FROM donation_types WHERE is_active = true ORDER BY id ASC');
    return NextResponse.json(res.rows);
  } catch (error) {
    console.error('Error fetching public donation types:', error);
    return NextResponse.json({ error: 'Failed to fetch donation types' }, { status: 500 });
  }
}
