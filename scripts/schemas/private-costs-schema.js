/**
 * JSON Schema for extracting Private Surgery Costs data
 * Used with Firecrawl JSON Mode (LLM Extract)
 * 
 * Expected output structure matches private_costs.csv:
 * - procedure_id, city, cost_min, cost_max, clinic_count, date, source
 */

export const privateCostsSchema = {
  type: "object",
  properties: {
    cost_min_gbp: {
      type: "number",
      description: "Minimum cost in GBP (British Pounds) for the procedure. Must be a positive number, typically between £1,000 and £50,000."
    },
    cost_max_gbp: {
      type: "number",
      description: "Maximum cost in GBP (British Pounds) for the procedure. Must be greater than or equal to cost_min_gbp."
    },
    clinic_count: {
      type: "number",
      description: "Number of clinics offering this procedure in the city. Must be a positive integer."
    },
    procedure_name: {
      type: "string",
      description: "Name of the procedure. Examples: 'Cataract Surgery', 'Hip Replacement', 'Knee Replacement'"
    },
    city: {
      type: "string",
      description: "City name. Examples: 'London', 'Manchester', 'Birmingham', 'Leeds', 'Bristol'"
    }
  },
  required: ["cost_min_gbp", "cost_max_gbp"]
};

export const privateCostsPrompt = (procedure, city) => {
  return `Extract private surgery cost information for ${procedure} in ${city}.

Look for:
1. Minimum cost in GBP (British Pounds) - the lowest price found
2. Maximum cost in GBP (British Pounds) - the highest price found
3. Number of clinics offering this procedure (count how many different clinics/prices you see)

The procedure might be referred to as:
- ${procedure === 'cataract' ? 'Cataract Surgery, Eye Surgery, Lens Extraction' : ''}
- ${procedure === 'hip' ? 'Hip Replacement, Total Hip Arthroplasty, THR, Hip Surgery' : ''}
- ${procedure === 'knee' ? 'Knee Replacement, Total Knee Arthroplasty, TKR, Knee Surgery' : ''}

The city is: ${city}

Prices might be shown as:
- "£2,500 - £4,000"
- "From £2,500"
- "£2,500 to £4,000"
- Individual clinic prices in a list or table

If you see a price range, extract the minimum and maximum.
If you only see one price, use it for both min and max.
Count all unique clinics/hospitals offering this procedure.
If prices are shown without currency symbol but are clearly in GBP, include them.
If you cannot find exact prices, try to estimate based on similar procedures or return the best available information.`;
};

/**
 * Example expected output:
 * {
 *   "cost_min_gbp": 2075,
 *   "cost_max_gbp": 5000,
 *   "clinic_count": 23,
 *   "procedure_name": "Cataract Surgery",
 *   "city": "London"
 * }
 */

export default {
  schema: privateCostsSchema,
  getPrompt: privateCostsPrompt
};

