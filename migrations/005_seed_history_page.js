const { query } = require('../src/lib/db');

async function migrate() {
  console.log('Running migration 005_seed_history_page...');

  const checkQuery = `SELECT id FROM cms_pages WHERE slug = 'history'`;
  const res = await query(checkQuery);

  if (res.rows.length === 0) {
    console.log('Seeding History page...');
    const insertQuery = `
      INSERT INTO cms_pages (title, title_te, slug, content, content_te, is_public, updated_at)
      VALUES ($1, $2, $3, $4, $5, true, NOW())
    `;
    const values = [
      'History of the Temple',
      'దేవాలయ చరిత్ర',
      'history',
      '<p>The Sri Venkateswara Swamy Temple has a rich and divine history that dates back several centuries. It stands as a monumental symbol of devotion, peace, and spiritual awakening.</p><h2>Origins</h2><p>Constructed by great devotees of the past, the temple was designed following the ancient Agama Shastras. It has been a beacon of hope and a sanctuary for millions of pilgrims.</p>',
      '<p>శ్రీ వెంకటేశ్వర స్వామి దేవాలయానికి అనేక శతాబ్దాల నాటి గొప్ప మరియు దివ్యమైన చరిత్ర ఉంది. ఇది భక్తి, శాంతి మరియు ఆధ్యాత్మిక మేల్కొలుపుకు స్మారక చిహ్నంగా నిలుస్తుంది.</p><h2>మూలాలు</h2><p>గత కాలపు గొప్ప భక్తులచే నిర్మించబడిన ఈ ఆలయం పురాతన ఆగమ శాస్త్రాలను అనుసరించి రూపొందించబడింది. ఇది లక్షలాది మంది యాత్రికులకు ఆశాకిరణంగా మరియు అభయారణ్యంగా ఉంది.</p>'
    ];
    await query(insertQuery, values);
    console.log('History page seeded successfully.');
  } else {
    console.log('History page already exists.');
  }
}

migrate().catch(console.error);
