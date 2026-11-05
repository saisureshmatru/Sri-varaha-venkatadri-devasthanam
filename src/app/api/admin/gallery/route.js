import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

import { uploadFileToR2 } from '@/lib/r2';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const title = formData.get('title') || '';
    const title_te = formData.get('title_te') || '';
    const media_type = formData.get('media_type') || 'IMAGE';
    let media_url = formData.get('media_url') || '';
    const file = formData.get('file');

    if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const fileName = `gallery/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '')}`;
      media_url = await uploadFileToR2(buffer, fileName, file.type);
    }

    if (!media_url) {
      return NextResponse.json({ error: 'No file or media URL provided' }, { status: 400 });
    }

    const res = await query(
      `INSERT INTO gallery_items (title, title_te, media_url, media_type) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [title, title_te, media_url, media_type]
    );

    return NextResponse.json({ message: 'Gallery item created successfully', item: res.rows[0] });
  } catch (error) {
    console.error('Failed to create gallery item:', error);
    return NextResponse.json({ error: 'Failed to create gallery item' }, { status: 500 });
  }
}
