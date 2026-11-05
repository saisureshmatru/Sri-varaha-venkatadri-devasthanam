import { query } from '@/lib/db';
import AdminCMSList from '@/components/admin/AdminCMSList';

export const dynamic = 'force-dynamic';

export default async function AdminCMSPage() {
  let pages = [];
  try {
    const res = await query('SELECT id, slug, title, title_te, content, content_te, is_public FROM cms_pages WHERE deleted_at IS NULL ORDER BY id ASC');
    pages = res.rows;
  } catch (error) {
    console.error('Failed to fetch CMS pages for admin:', error);
  }

  return <AdminCMSList initialPages={pages} />;
}
