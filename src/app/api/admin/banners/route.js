import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { uploadFileToR2 } from '@/lib/r2';

export async function GET(req) {
  try {
    const res = await query('SELECT * FROM home_banners ORDER BY display_order ASC, created_at DESC');
    return NextResponse.json(res.rows);
  } catch (error) {
    console.error('Error fetching admin banners:', error);
    return NextResponse.json({ error: 'Failed to fetch banners' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    const title = formData.get('title') || '';
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `banners/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '')}`;
    
    const imageUrl = await uploadFileToR2(buffer, fileName, file.type);
    
    const insertQuery = `
      INSERT INTO home_banners (image_url, title, is_active, display_order)
      VALUES ($1, $2, true, 0)
      RETURNING *
    `;
    const dbRes = await query(insertQuery, [imageUrl, title]);
    
    return NextResponse.json(dbRes.rows[0]);
  } catch (error) {
    console.error('Error uploading banner:', error);
    return NextResponse.json({ error: 'Failed to upload banner' }, { status: 500 });
  }
}
