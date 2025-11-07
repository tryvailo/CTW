/**
 * Пример использования JSON Mode (LLM Extract) для извлечения структурированных данных
 * Демонстрирует, как использовать v2 API с JSON схемами
 */

import FirecrawlApp from 'firecrawl';

const app = new FirecrawlApp({ apiKey: process.env.FIRECRAWL_API_KEY });

/**
 * Пример 1: Извлечение NHS waiting times с JSON схемой
 */
async function extractNHSWaitsWithJSONMode(url, procedure, city) {
  const schema = {
    type: "object",
    properties: {
      avg_wait_weeks: {
        type: "number",
        description: "Average waiting time in weeks for the procedure"
      },
      nhs_trust: {
        type: "string",
        description: "Name of the NHS Trust providing the service"
      },
      percent_within_18_weeks: {
        type: "number",
        description: "Percentage of patients seen within 18 weeks target"
      }
    },
    required: ["avg_wait_weeks", "nhs_trust"]
  };

  const prompt = `Extract waiting time information for ${procedure} surgery in ${city}. 
    Look for average wait times, NHS Trust name, and percentage within 18 weeks target.`;

  try {
    const result = await app.scrape(url, {
      formats: [{
        type: "json",
        schema: schema,
        prompt: prompt
      }],
      onlyMainContent: false,
      timeout: 30000
    });

    if (result.data?.json) {
      return {
        procedure_id: procedure,
        city: city,
        nhs_trust: result.data.json.nhs_trust,
        avg_wait_weeks: result.data.json.avg_wait_weeks,
        percent_within_18_weeks: result.data.json.percent_within_18_weeks || null,
        date: new Date().toISOString().split('T')[0],
        source: 'My Planned Care'
      };
    }
  } catch (error) {
    console.error('Error extracting with JSON mode:', error.message);
  }

  return null;
}

/**
 * Пример 2: Извлечение private costs с JSON схемой
 */
async function extractPHINCostsWithJSONMode(url, procedure, city) {
  const schema = {
    type: "object",
    properties: {
      cost_min_gbp: {
        type: "number",
        description: "Minimum cost in GBP for the procedure"
      },
      cost_max_gbp: {
        type: "number",
        description: "Maximum cost in GBP for the procedure"
      },
      clinic_count: {
        type: "number",
        description: "Number of clinics offering this procedure"
      }
    },
    required: ["cost_min_gbp", "cost_max_gbp"]
  };

  const prompt = `Extract private surgery cost information for ${procedure} in ${city}. 
    Find the price range (minimum and maximum costs) and count how many clinics offer this procedure.`;

  try {
    const result = await app.scrape(url, {
      formats: [{
        type: "json",
        schema: schema,
        prompt: prompt
      }],
      onlyMainContent: false,
      timeout: 30000
    });

    if (result.data?.json) {
      return {
        procedure_id: procedure,
        city: city,
        cost_min: result.data.json.cost_min_gbp,
        cost_max: result.data.json.cost_max_gbp,
        clinic_count: result.data.json.clinic_count || 0,
        date: new Date().toISOString().split('T')[0],
        source: 'PHIN + clinic websites'
      };
    }
  } catch (error) {
    console.error('Error extracting with JSON mode:', error.message);
  }

  return null;
}

/**
 * Пример 3: Извлечение списка клиник с JSON схемой
 */
async function extractClinicsWithJSONMode(url, procedure, city) {
  const schema = {
    type: "array",
    items: {
      type: "object",
      properties: {
        clinic_name: {
          type: "string",
          description: "Name of the private clinic"
        },
        price_gbp: {
          type: "number",
          description: "Price for the procedure in GBP"
        },
        phone_number: {
          type: "string",
          description: "Contact phone number"
        },
        website_url: {
          type: "string",
          description: "Website URL of the clinic"
        }
      },
      required: ["clinic_name", "price_gbp"]
    }
  };

  const prompt = `Extract a list of private clinics offering ${procedure} surgery in ${city}. 
    For each clinic, find the name, price, phone number, and website URL. 
    Return up to 5 clinics.`;

  try {
    const result = await app.scrape(url, {
      formats: [{
        type: "json",
        schema: schema,
        prompt: prompt
      }],
      onlyMainContent: false,
      timeout: 30000
    });

    if (result.data?.json && Array.isArray(result.data.json)) {
      return result.data.json.map(clinic => ({
        clinic_id: `${clinic.clinic_name.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_${city.toLowerCase()}_${procedure}`,
        name: clinic.clinic_name,
        city: city,
        procedure_id: procedure,
        price: clinic.price_gbp,
        url: clinic.website_url || '',
        phone: clinic.phone_number || '',
        last_updated: new Date().toISOString().split('T')[0]
      }));
    }
  } catch (error) {
    console.error('Error extracting with JSON mode:', error.message);
  }

  return [];
}

// Экспорт для использования в основном скрипте
export {
  extractNHSWaitsWithJSONMode,
  extractPHINCostsWithJSONMode,
  extractClinicsWithJSONMode
};

