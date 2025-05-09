/**
 * Script to test the REST Countries API wrapper directly
 */
import restCountriesApi from '../src/lib/restCountries';

async function testApi() {
  try {
    console.log('Fetching countries...');
    const countries = await restCountriesApi.getCountries();
    console.log(`Successfully fetched ${countries.length} countries`);
    console.log('First country:', countries[0]);
  } catch (error) {
    console.error('API test failed:', error);
  }
}

testApi(); 