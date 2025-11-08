/**
 * JSON Schema for extracting Private Clinic Details data
 * Used with Firecrawl JSON Mode (LLM Extract)
 * 
 * Expected output structure matches clinics.csv:
 * - clinic_id, name, city, procedure_id, price, url, phone, address, rating_stars, rating_count, cqc_rating, hospital_group, last_updated, details_last_updated
 * 
 * Returns an array of clinic objects (up to 5 clinics)
 */

export const clinicsSchema = {
  type: "array",
  items: {
    type: "object",
    properties: {
      clinic_name: {
        type: "string",
        description: "Full name of the private clinic or hospital. Examples: 'King Edward VII Hospital', 'Optimal Vision', 'Moorfields Private'"
      },
      price_gbp: {
        type: "number",
        description: "Price for the procedure in GBP (British Pounds). Must be a positive number."
      },
      phone_number: {
        type: "string",
        description: "Contact phone number. May include country code (+44) or UK area codes (020, 0121, etc.). Examples: '+44 20 1234 5678', '020 1234 5678'"
      },
      website_url: {
        type: "string",
        description: "Full website URL of the clinic. Must start with http:// or https://. Examples: 'https://www.clinicname.co.uk'"
      },
      address: {
        type: "string",
        description: "Physical address of the clinic (optional). Include street, city, postcode if available."
      },
      rating_stars: {
        type: "number",
        description: "Hospital rating out of 5 stars (e.g., 4.5), or null if not available"
      },
      rating_count: {
        type: "integer",
        description: "Number of ratings/reviews, or null if not available"
      },
      cqc_rating: {
        type: "string",
        enum: ["Outstanding", "Good", "Requires improvement", "Inadequate", null],
        description: "Care Quality Commission rating if shown on the page, or null"
      },
      hospital_group: {
        type: "string",
        description: "Hospital group/chain name (e.g., 'Circle Health Group', 'Spire Healthcare', 'Nuffield Health', 'Ramsay Health'), or null if not available"
      }
    },
    required: ["clinic_name", "price_gbp"]
  },
  maxItems: 5,
  minItems: 1
};

export const clinicsPrompt = (procedure, city) => {
  return `Extract a list of private clinics offering ${procedure} surgery in ${city}.

For each clinic, find:
1. Clinic name (full official name)
2. Price in GBP (British Pounds) for this specific procedure
3. Phone number (if available)
4. Website URL (if available)
5. Address (if available) - full address including street, city, and postcode
6. Rating stars (if available) - overall rating out of 5 stars
7. Rating count (if available) - number of reviews/ratings
8. CQC rating (if available) - Care Quality Commission rating (Outstanding, Good, Requires improvement, Inadequate)
9. Hospital group (if available) - hospital chain/group name (e.g., Circle Health Group, Spire Healthcare, Nuffield Health, Ramsay Health)

The procedure might be referred to as:
- ${procedure === 'cataract' ? 'Cataract Surgery, Eye Surgery, Lens Extraction' : ''}
- ${procedure === 'hip' ? 'Hip Replacement, Total Hip Arthroplasty, THR' : ''}
- ${procedure === 'knee' ? 'Knee Replacement, Total Knee Arthroplasty, TKR' : ''}

The city is: ${city}

Return up to 5 clinics. Prioritize:
- Clinics with complete information (name, price, contact)
- Clinics with lower prices (better value)
- Well-known or reputable clinics

If a clinic has multiple prices listed, use the most common or advertised price.
If phone number is not available, leave it as null or empty string.
If website URL is not available, leave it as null or empty string.
If rating, CQC rating, or hospital group is not available, leave it as null.
Make sure each clinic has at least a name and price.`;
};

/**
 * Example expected output:
 * [
 *   {
 *     "clinic_name": "King Edward VII Hospital Sister Agnes",
 *     "price_gbp": 1200,
 *     "phone_number": "020 7486 4411",
 *     "website_url": "https://www.kingedwardvii.co.uk",
 *     "address": "1 Beaumont Street, London W1G 6AA",
 *     "rating_stars": 4.5,
 *     "rating_count": 23,
 *     "cqc_rating": "Good",
 *     "hospital_group": null
 *   },
 *   {
 *     "clinic_name": "Optimal Vision",
 *     "price_gbp": 1450,
 *     "phone_number": "020 7183 3725",
 *     "website_url": "https://www.optimalvision.co.uk",
 *     "address": "123 Harley Street, London W1G 6AT",
 *     "rating_stars": 4.2,
 *     "rating_count": 15,
 *     "cqc_rating": null,
 *     "hospital_group": null
 *   }
 * ]
 */

export default {
  schema: clinicsSchema,
  getPrompt: clinicsPrompt
};

