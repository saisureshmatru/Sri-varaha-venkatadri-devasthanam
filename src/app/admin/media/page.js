import { query } from '@/lib/db';
import MediaManager from '@/components/admin/MediaManager';

export const dynamic = 'force-dynamic';

export default async function AdminMediaPage() {
  let galleryItems = [];
  try {
    const res = await query('SELECT id, title, title_te, media_url, media_type, deleted_at FROM gallery_items ORDER BY created_at DESC');
    galleryItems = res.rows;
  } catch (error) {
    console.error('Failed to fetch gallery items for admin media page:', error);
  }

  return <MediaManager initialGalleryItems={galleryItems} />;
}
