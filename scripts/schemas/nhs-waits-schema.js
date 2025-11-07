/**
 * JSON Schema for extracting NHS Waiting Times data
 * Used with Firecrawl JSON Mode (LLM Extract)
 * 
 * Expected output structure matches nhs_waits.csv:
 * - procedure_id, city, nhs_trust, avg_wait_weeks, date, source
 */

export const nhsWaitsSchema = {
  type: "object",
  properties: {
    avg_wait_weeks: {
      type: "number",
      description: "Average waiting time in weeks for the procedure. Must be a number between 0 and 100."
    },
    nhs_trust: {
      type: "string",
      description: "Name of the NHS Trust providing the service. Examples: 'Barts Health NHS Trust', 'Manchester University NHS Foundation Trust'"
    },
    percent_within_18_weeks: {
      type: "number",
      description: "Percentage of patients seen within the 18-week target (optional). Number between 0 and 100."
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
  required: ["avg_wait_weeks", "nhs_trust"]
};

export const nhsWaitsPrompt = (procedure, city) => {
  return `Extract NHS waiting time information for ${procedure} surgery in ${city}.

Look for:
1. Average waiting time in weeks (this is the most important number)
2. NHS Trust name providing the service
3. Percentage of patients seen within 18 weeks target (if available)

The procedure might be referred to as:
- ${procedure === 'cataract' ? 'Cataract Surgery, Eye Surgery, Ophthalmology' : ''}
- ${procedure === 'hip' ? 'Hip Replacement, Total Hip Arthroplasty, THR' : ''}
- ${procedure === 'knee' ? 'Knee Replacement, Total Knee Arthroplasty, TKR' : ''}

The city is: ${city}

If you find multiple NHS Trusts for this city, extract the primary one or the one most relevant to the procedure.
If waiting time is given in months, convert to weeks (1 month = 4.33 weeks).
If you cannot find the exact information, return null for optional fields but always try to find avg_wait_weeks and nhs_trust.`;
};

/**
 * Example expected output:
 * {
 *   "avg_wait_weeks": 18,
 *   "nhs_trust": "Barts Health NHS Trust",
 *   "percent_within_18_weeks": 72,
 *   "procedure_name": "Cataract Surgery",
 *   "city": "London"
 * }
 */

export default {
  schema: nhsWaitsSchema,
  getPrompt: nhsWaitsPrompt
};

