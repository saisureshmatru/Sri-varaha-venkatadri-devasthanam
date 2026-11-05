import { query } from '@/lib/db';
import SevaBookingForm from '@/components/public/SevaBookingForm';
import { notFound } from 'next/navigation';

export default async function SevaBookingPage({ params }) {
  const { slug } = await params;
  
  let seva = null;
  let slots = [];

  try {
    const sevaRes = await query('SELECT * FROM sevas WHERE slug = $1 AND is_active = true AND is_public = true', [slug]);
    if (sevaRes.rows.length === 0) {
      return notFound();
    }
    seva = sevaRes.rows[0];

    const slotsRes = await query('SELECT * FROM seva_slots WHERE seva_id = $1 ORDER BY id ASC', [seva.id]);
    slots = slotsRes.rows;
  } catch (error) {
    console.error('Failed to fetch seva details by slug:', error);
    return notFound();
  }

  return <SevaBookingForm seva={seva} slots={slots} />;
}
