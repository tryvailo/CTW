/**
 * Prompts Configuration for Firecrawl JSON Mode
 * All prompts are externalized here, not in code
 */

export const treatmentConnectPrompt = {
  base: `You are extracting pricing information from TreatmentConnect.co.uk hospital pages.

CRITICAL RULES:
1. Extract ONLY numeric values for all prices (no currency symbols, no commas)
2. Convert "£2,500" to 2500
3. Convert "£2.5k" to 2500
4. If price shows "From £X", return X as price_min_gbp
5. If single price shown, set price_min_gbp = price_max_gbp = price_gbp
6. Extract hospital name from the page title or H1 heading
7. City is usually shown in the address section
8. Rating is shown as "X out of 5 stars" - extract the X value
9. Look for text like "Average UK price: £X" for avg_uk_price
10. Look for "Price range across all UK hospitals: £X to £Y" for UK ranges

EXAMPLE PAGE STRUCTURE:
- H1: "Hospital Name | Procedure £X"
- Extract "Hospital Name" as hospital_name
- Extract X as price_gbp
- Look for other price indicators in the page body

IGNORE:
- Consultation fees (unless specified as part of procedure)
- Advertising sections
- Nearby hospital suggestions

RETURN:
- Only the JSON object matching the schema
- No explanatory text
- No markdown formatting`,

  // Procedure-specific additions
  procedure_context: {
    cataract: `The procedure is Cataract Surgery (also called Eye Surgery, Lens Extraction).
Focus on extracting the standard cataract surgery price, not premium lens options.`,
    
    hip: `The procedure is Hip Replacement (also called Total Hip Arthroplasty, THR, Hip Surgery).
Extract the standard hip replacement price.`,
    
    knee: `The procedure is Knee Replacement (also called Total Knee Arthroplasty, TKR, Knee Surgery).
Extract the standard knee replacement price.`
  }
};

export const spirePrompt = {
  base: `Extract pricing for Spire Healthcare procedures.

KEY PATTERNS:
1. Look for text: "standard cataract surgery package for £X"
2. Look for: "From £X" - this is the starting price
3. Look for: "Guide price: £X"
4. Different lens types may have different prices - extract the STANDARD price
5. Hospital name is in URL and page title

PRICE VARIATIONS:
- Monofocal lens = standard price
- Multifocal/Toric lens = premium (ignore or put in price_premium_gbp)
- Quote 'standard cataract package' = look for this specific text

EXAMPLE TEXT:
"At Spire Edinburgh Hospitals, we know that your vision is precious. That's why we now offer a standard cataract surgery package for £2,000"

EXTRACT:
- hospital_name: "Spire Edinburgh Hospitals"
- price_standard_gbp: 2000
- price_type: "package"

DISCLAIMERS TO IGNORE:
- "Price may vary depending on consultant"
- "From price (ie the minimum cost)"
- These are legal disclaimers, still extract the stated price`
};

export const nuffieldPrompt = {
  base: `Extract pricing from Nuffield Health hospital pages.

KEY PATTERNS:
1. Look for "Guide price: £X" or "From £X"
2. Nuffield uses "guide price stated above is an approximation"
3. Look for text about "fixed all-inclusive price"
4. Hospital name format: "Nuffield Health [City] Hospital"

IMPORTANT:
- Nuffield often doesn't show exact prices on procedure pages
- Look for price indicators in the sidebar or pricing section
- If no price found, return price_standard_gbp: 0 and note in comments
- Check for separate pricing page links

WHAT'S INCLUDED:
- Look for bullet points about what's in the price
- Unlimited aftercare is typically included
- Consultant fees may be separate

FORMAT:
Return the schema with all available fields, use null for missing data`
};

export const circlePrompt = {
  base: `Extract pricing from Circle Health Group pages.

KEY PATTERNS:
1. Central pages show "starts from £X"
2. Hospital-specific pages may show exact prices
3. Look for: "The cost of [procedure] with Circle Health Group starts from £X"
4. Finance examples are NOT the procedure price - ignore these

FINANCE EXAMPLES TO IGNORE:
"Representative Example: Total amount of credit £10,995.00"
"Repayable by 60 monthly payments of £189.82"
These are FINANCING info, not procedure prices

ACTUAL PRICES:
"The cost of private knee replacement surgery with Circle Health Group starts from around £14,888"
EXTRACT: 14888

HOSPITAL NAMES:
- Circle owns many hospitals: "The London Independent Hospital, part of Circle Health Group"
- Extract the specific hospital name before "part of Circle"

PACKAGE INFO:
- "fixed-price packages include the cost of your surgery and all appropriate aftercare"
- Set includes_aftercare: true`
};

/**
 * Get prompt for TreatmentConnect with procedure context
 * @param {string} procedure - Procedure ID (cataract, hip, knee)
 * @param {string} city - City name
 * @returns {string} Complete prompt for Firecrawl
 */
export function getTreatmentConnectPrompt(procedure, city) {
  const procedureContext = treatmentConnectPrompt.procedure_context[procedure] || '';
  
  return `${treatmentConnectPrompt.base}

${procedureContext}

The city is: ${city}

Focus on extracting accurate pricing data for ${procedure} in ${city}.`;
}

export default {
  treatmentConnectPrompt,
  spirePrompt,
  nuffieldPrompt,
  circlePrompt,
  getTreatmentConnectPrompt
};

