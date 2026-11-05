import { query } from '@/lib/db';
import AdminSevasList from '@/components/admin/AdminSevasList';

export const dynamic = 'force-dynamic'; // Ensure this page doesn't cache stale data

export default async function AdminSevasPage() {
  let sevas = [];
  try {
    const res = await query('SELECT id, slug, title, title_te, description, description_te, amount, is_public FROM sevas ORDER BY id ASC');
    sevas = res.rows;
  } catch (error) {
    console.error('Failed to fetch sevas for admin:', error);
  }

  return <AdminSevasList initialSevas={sevas} />;
}
