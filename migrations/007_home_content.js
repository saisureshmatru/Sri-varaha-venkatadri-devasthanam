require('dotenv').config({ path: '.env.local' });
require('dotenv').config();
const { query } = require('../src/lib/db');

async function migrate() {
  console.log('Running migration 007_home_content...');

  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS site_content (
        key VARCHAR(255) PRIMARY KEY,
        value_en TEXT,
        value_te TEXT,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await query(createTableQuery);

    // Seed initial data based on locales/en.json and te.json
    const initialData = [
      ['home_welcome', 'Welcome to Sri Varaha Venkatadri Devasthanam', 'శ్రీ వరాహ వేంకటాద్రి దేవస్థానానికి స్వాగతం'],
      ['home_subtitle', 'Experience the divine presence and seek blessings for peace and prosperity.', 'దివ్యమైన ఉనికిని అనుభవించండి మరియు శాంతి, శ్రేయస్సు కోసం ఆశీర్వాదాలు పొందండి.'],
      ['home_about_title', 'About the Temple', 'ఆలయం గురించి'],
      ['home_about_p1', 'Sri Varaha Venkatadri Devasthanam is a landmark of spiritual significance, drawing devotees from all over the world. Our mission is to promote the timeless values of devotion, service, and peace.', 'శ్రీ వరాహ వేంకటాద్రి దేవస్థానం ఆధ్యాత్మిక ప్రాముఖ్యత కలిగిన ఒక ప్రసిద్ధ పుణ్యక్షేత్రం, ఇది ప్రపంచం నలుమూలల నుండి భక్తులను ఆకర్షిస్తుంది. భక్తి, సేవ మరియు శాంతి యొక్క శాశ్వత విలువలను ప్రోత్సహించడమే మా లక్ష్యం.'],
      ['home_about_p2', 'We host regular poojas, sevas, and large-scale festivals that provide a deeply enriching experience for all devotees.', 'మేము భక్తులందరికీ లోతైన మరియు సుసంపన్నమైన అనుభవాన్ని అందించే సాధారణ పూజలు, సేవలు మరియు పెద్ద ఎత్తున పండుగలను నిర్వహిస్తాము.'],
      ['home_history_intro', 'Sri Varaha Venkatadri Devasthanam is a renowned pilgrimage site...', 'శ్రీ వరాహ వేంకటాద్రి దేవస్థానం ఒక ప్రసిద్ధ పుణ్యక్షేత్రం...'],
      ['home_history_main', 'The temple is known for its traditional South Indian architecture, with a beautifully adorned entrance and a majestic gopuram...', 'ఈ దేవాలయం అద్భుతమైన ప్రవేశ ద్వారం మరియు గంభీరమైన గోపురంతో సంప్రదాయ దక్షిణ భారత వాస్తుశిల్పానికి ప్రసిద్ధి చెందింది...']
    ];

    for (const item of initialData) {
      await query(`
        INSERT INTO site_content (key, value_en, value_te) 
        VALUES ($1, $2, $3)
        ON CONFLICT (key) DO NOTHING
      `, item);
    }
    console.log('Table site_content created and seeded.');
  } catch (error) {
    console.error('Error creating site_content table:', error);
  }
}

migrate().catch(console.error);
