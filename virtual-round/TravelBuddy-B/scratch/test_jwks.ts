import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

async function testJwks() {
  const configUrl = `https://jzufgvdalkcwslmaqdvz.supabase.co/auth/v1/.well-known/openid-configuration`;
  const anonKey = process.env.SUPABASE_ANON_KEY || '';
  
  console.log('Fetching OpenID Config from:', configUrl);

  try {
    const configRes = await axios.get(configUrl, {
      headers: { 'apikey': anonKey.trim() }
    });
    console.log('Config found! JWKS URI:', configRes.data.jwks_uri);
    
    const jwksRes = await axios.get(configRes.data.jwks_uri, {
      headers: { 'apikey': anonKey.trim() }
    });
    console.log('Success fetching JWKS! Keys:', jwksRes.data.keys?.length);
    console.log('Key IDs:', jwksRes.data.keys?.map((k: any) => k.kid));
  } catch (err: any) {
    console.error('Failed! Status:', err.response?.status);
    console.error('Response body:', JSON.stringify(err.response?.data));
    console.error('Error message:', err.message);
  }
}

testJwks();
