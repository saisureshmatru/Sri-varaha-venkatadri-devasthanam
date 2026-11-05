import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const sevasCountRes = await query(`SELECT COUNT(*) FROM sevas WHERE is_public = true`);
    const festivalsCountRes = await query(`SELECT COUNT(*) FROM events WHERE type = 'FESTIVAL' AND is_active = true`);

    const hasSevas = parseInt(sevasCountRes.rows[0].count) > 0;
    const hasFestivals = parseInt(festivalsCountRes.rows[0].count) > 0;

    return NextResponse.json({ hasSevas, hasFestivals });
  } catch (error) {
    console.error('Error fetching nav state:', error);
    return NextResponse.json({ hasSevas: true, hasFestivals: true });
  }
}
