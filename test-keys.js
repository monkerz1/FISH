require('dotenv').config({ path: '/home/monkerz/.env' });
const { createClient } = require('@supabase/supabase-js');

// Test Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function testKeys() {
  console.log('Testing Supabase...');
  const { data, error } = await supabase.from('_test').select('*').limit(1);
  if (error && error.code === '42P01') {
    console.log('✅ Supabase connected successfully (table does not exist yet, which is expected)');
  } else if (error) {
    console.log('❌ Supabase error:', error.message);
  } else {
    console.log('✅ Supabase connected successfully');
  }

  // Test Google Places API
  console.log('Testing Google Places API...');
  const response = await fetch(
    `https://places.googleapis.com/v1/places:searchText`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': process.env.GOOGLE_PLACES_API_KEY,
        'X-Goog-FieldMask': 'places.displayName'
      },
      body: JSON.stringify({ textQuery: 'fish store near Chicago' })
    }
  );
  const json = await response.json();
  if (json.places && json.places.length > 0) {
    console.log('✅ Google Places API working - found', json.places.length, 'results');
    console.log('   First result:', json.places[0].displayName.text);
  } else {
    console.log('❌ Google Places API error:', JSON.stringify(json));
  }
}

testKeys();
