import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const res = await query('SELECT key, value_en, value_te FROM site_content');
    
    // Transform into a key-value object
    const content = {};
    res.rows.forEach(row => {
      content[row.key] = {
        en: row.value_en,
        te: row.value_te
      };
    });

    return NextResponse.json(content);
  } catch (error) {
    console.error('Error fetching public site content:', error);
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
  }
}
