import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-secret-for-development'
);

export async function POST(request) {
  try {
    const { sevaId, slotId, date } = await request.json();

    if (!sevaId || !slotId || !date) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Await the cookies promise first, as required in Next.js 15
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    let userId = null;
    if (token) {
      try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        userId = payload.id;
      } catch (e) {
        console.error('Invalid token during booking');
      }
    }

    if (!userId) {
       return NextResponse.json({ error: 'You must be logged in to book a seva' }, { status: 401 });
    }

    // Verify slot exists and has capacity (Simplified check)
    const slotRes = await query('SELECT * FROM seva_slots WHERE id = $1 AND seva_id = $2', [slotId, sevaId]);
    if (slotRes.rows.length === 0) {
      return NextResponse.json({ error: 'Invalid slot selected' }, { status: 400 });
    }

    // Fetch amount from seva
    const sevaRes = await query('SELECT amount FROM sevas WHERE id = $1', [sevaId]);
    if (sevaRes.rows.length === 0) {
      return NextResponse.json({ error: 'Invalid seva selected' }, { status: 400 });
    }
    const amount = sevaRes.rows[0].amount;

    // Create booking (Payment status PENDING)
    const insertRes = await query(
      'INSERT INTO seva_bookings (user_id, seva_id, slot_id, booking_date, amount, payment_status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      [userId, sevaId, slotId, date, amount, 'PENDING']
    );

    return NextResponse.json({ message: 'Booking created', bookingId: insertRes.rows[0].id });
  } catch (error) {
    console.error('Failed to create booking:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
