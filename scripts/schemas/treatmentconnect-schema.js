/**
 * JSON Schema for TreatmentConnect.co.uk data extraction
 * Used with Firecrawl JSON Mode (LLM Extract)
 * 
 * TreatmentConnect provides structured pricing data from 146+ UK private hospitals
 */

// Import prompts config at module level
import { getTreatmentConnectPrompt as getPromptFromConfig } from '../config/prompts-config.js';

export const treatmentConnectSchema = {
  type: "object",
  properties: {
    hospital_name: {
      type: "string",
      description: "Full name of the hospital or clinic as shown on the page"
    },
    procedure_name: {
      type: "string",
      description: "Name of the medical procedure (Cataract Surgery, Hip Replacement, Knee Replacement)"
    },
    price_gbp: {
      type: "number",
      description: "Main price in GBP (numeric only, no currency symbols or commas). Convert '£2,500' to 2500"
    },
    price_min_gbp: {
      type: "number",
      description: "Minimum price if range shown, otherwise same as price_gbp. If 'From £X' is shown, use X as minimum"
    },
    price_max_gbp: {
      type: "number",
      description: "Maximum price if range shown, otherwise same as price_gbp"
    },
    city: {
      type: "string",
      description: "City where hospital is located (London, Manchester, Birmingham, Leeds, Bristol, etc.)"
    },
    postcode: {
      type: "string",
      description: "Hospital postcode if available in address section"
    },
    rating_stars: {
      type: "number",
      description: "Hospital rating out of 5 stars (e.g., 4.5), or null if not available"
    },
    rating_count: {
      type: "integer",
      description: "Number of ratings/reviews, or null if not available"
    },
    avg_uk_price: {
      type: "number",
      description: "Average UK price shown on page (e.g., 'Average UK price: £2,843'), or null if not available"
    },
    price_range_uk_min: {
      type: "number",
      description: "UK-wide minimum price shown (e.g., 'Price range: £1,995 to £3,765'), or null"
    },
    price_range_uk_max: {
      type: "number",
      description: "UK-wide maximum price shown, or null"
    },
    website_url: {
      type: "string",
      description: "Hospital's official website URL if shown on the page (e.g., 'Visit our website: https://www.hospital.co.uk'). If not shown, use the TreatmentConnect page URL as fallback"
    },
    phone_number: {
      type: "string",
      description: "Hospital's contact phone number if shown on the page (e.g., '+44 20 1234 5678' or '020 1234 5678'), or null if not available"
    },
    address: {
      type: "string",
      description: "Full hospital address if shown on the page, or null if not available"
    }
  },
  required: ["hospital_name", "procedure_name", "price_gbp", "city", "website_url"]
};

/**
 * Get prompt for TreatmentConnect extraction
 * Uses external prompts configuration
 */
export function getTreatmentConnectPrompt(procedure, city) {
  return getPromptFromConfig(procedure, city);
}

/**
 * Example expected output:
 * {
 *   "hospital_name": "Spire London East Hospital",
 *   "procedure_name": "Cataract Surgery",
 *   "price_gbp": 2000,
 *   "price_min_gbp": 2000,
 *   "price_max_gbp": 2000,
 *   "city": "London",
 *   "postcode": "E1 1BB",
 *   "rating_stars": 4.5,
 *   "rating_count": 23,
 *   "avg_uk_price": 2843,
 *   "price_range_uk_min": 1995,
 *   "price_range_uk_max": 3765,
 *   "website_url": "https://www.spirehealthcare.com/hospitals/spire-london-east-hospital/",
 *   "phone_number": "+44 20 7791 1800",
 *   "address": "Spire London East Hospital, Roding Lane South, Ilford, Essex IG4 5PZ"
 * }
 */

export default {
  schema: treatmentConnectSchema,
  getPrompt: getTreatmentConnectPrompt
};

