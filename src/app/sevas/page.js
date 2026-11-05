import { query } from '@/lib/db';
import SevasList from '@/components/public/SevasList';

export default async function SevasPage() {
  let sevas = [];
  try {
    const res = await query('SELECT id, slug, title, description, amount, image_url FROM sevas WHERE is_active = true AND is_public = true ORDER BY id ASC');
    sevas = res.rows;
  } catch (error) {
    console.error('Failed to fetch sevas:', error);
  }

  return <SevasList sevas={sevas} />;
}
