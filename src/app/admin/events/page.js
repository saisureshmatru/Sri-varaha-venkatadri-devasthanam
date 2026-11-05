import { query } from '@/lib/db';
import AdminEventsList from '@/components/admin/AdminEventsList';

export const dynamic = 'force-dynamic';

export default async function AdminEventsPage() {
  let events = [];
  try {
    const res = await query('SELECT id, title, title_te, description, description_te, event_date, type, image_url, is_active FROM events ORDER BY event_date DESC, id DESC');
    events = res.rows;
  } catch (error) {
    console.error('Failed to fetch events for admin:', error);
  }

  return <AdminEventsList initialEvents={events} />;
}
