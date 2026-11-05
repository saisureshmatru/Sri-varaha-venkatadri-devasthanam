import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await query(`
      CREATE TABLE IF NOT EXISTS donation_types (
        id SERIAL PRIMARY KEY,
        name_en VARCHAR(255) NOT NULL,
        name_te VARCHAR(255) NOT NULL,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Seed default data if table is empty
    const res = await query('SELECT COUNT(*) FROM donation_types');
    if (parseInt(res.rows[0].count) === 0) {
      await query(`
        INSERT INTO donation_types (name_en, name_te) VALUES
        ('General Donation', 'సాధారణ విరాళం'),
        ('Annadanam (Free Meals)', 'అన్నదానం (ఉచిత భోజనం)'),
        ('Temple Development', 'ఆలయ అభివృద్ధి'),
        ('Goshala (Cow Shelter)', 'గోశాల (ఆవుల సంరక్షణ)'),
        ('Festival Donation', 'పండుగ విరాళం')
      `);
      return NextResponse.json({ success: true, message: 'Table created and seeded' });
    }
    
    return NextResponse.json({ success: true, message: 'Table verified (already had data)' });
  } catch (error) {
    console.error('Migration failed:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
