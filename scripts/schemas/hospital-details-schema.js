/**
 * JSON Schema for extracting Hospital Details from TreatmentConnect main hospital page
 * Used with Firecrawl JSON Mode (LLM Extract)
 * 
 * This schema is used for the main hospital page: /hospitals/{hospital}/
 * Extracts contact information, ratings, and other details that don't change frequently
 */

import { getHospitalDetailsPrompt as getPromptFromConfig } from '../config/prompts-config.js';

export const hospitalDetailsSchema = {
  type: "object",
  properties: {
    hospital_name: {
      type: "string",
      description: "Full name of the hospital or clinic as shown on the page"
    },
    website_url: {
      type: "string",
      description: "Hospital's official website URL if shown on the page (e.g., 'Visit our website: https://www.hospital.co.uk'). If not shown, use null"
    },
    phone_number: {
      type: "string",
      description: "Hospital's contact phone number if shown on the page (e.g., '+44 20 1234 5678' or '020 1234 5678'), or null if not available"
    },
    address: {
      type: "string",
      description: "Full hospital address including street, city, and postcode if shown on the page, or null if not available"
    },
    postcode: {
      type: "string",
      description: "Hospital postcode if available in address section, or null"
    },
    city: {
      type: "string",
      description: "City where hospital is located (London, Manchester, Birmingham, Leeds, Bristol, etc.)"
    },
    rating_stars: {
      type: "number",
      description: "Hospital rating out of 5 stars (e.g., 4.5), or null if not available"
    },
    rating_count: {
      type: "integer",
      description: "Number of ratings/reviews, or null if not available"
    },
    rating_categories: {
      type: "object",
      description: "Detailed rating categories if available",
      properties: {
        cleanliness: {
          type: "number",
          description: "Cleanliness rating out of 5"
        },
        staff_cooperation: {
          type: "number",
          description: "Staff cooperation rating out of 5"
        },
        dignity_respect: {
          type: "number",
          description: "Dignity and respect rating out of 5"
        },
        involvement_decisions: {
          type: "number",
          description: "Involvement in decisions rating out of 5"
        },
        accommodation: {
          type: "number",
          description: "Accommodation rating out of 5"
        }
      }
    },
    recommendation_percentage: {
      type: "number",
      description: "Percentage who would recommend (e.g., 87% becomes 87), or null if not available"
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
  required: ["hospital_name"]
};

/**
 * Get prompt for hospital details extraction
 * Uses external prompts configuration
 */
export function getHospitalDetailsPrompt(city) {
  return getPromptFromConfig(city);
}

/**
 * Example expected output:
 * {
 *   "hospital_name": "Spire London East Hospital",
 *   "website_url": "https://www.spirehealthcare.com/hospitals/spire-london-east-hospital/",
 *   "phone_number": "+44 20 7791 1800",
 *   "address": "Spire London East Hospital, Roding Lane South, Ilford, Essex IG4 5PZ",
 *   "postcode": "IG4 5PZ",
 *   "city": "London",
 *   "rating_stars": 4.5,
 *   "rating_count": 23,
 *   "rating_categories": {
 *     "cleanliness": 4.6,
 *     "staff_cooperation": 4.5,
 *     "dignity_respect": 4.7,
 *     "involvement_decisions": 4.4,
 *     "accommodation": 4.3
 *   },
 *   "recommendation_percentage": 87,
 *   "cqc_rating": "Good",
 *   "hospital_group": "Spire Healthcare"
 * }
 */

export default {
  schema: hospitalDetailsSchema,
  getPrompt: getHospitalDetailsPrompt
};

