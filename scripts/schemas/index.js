/**
 * Index file for all JSON schemas
 * Exports all schemas and prompts for use in scraper.js
 */

import nhsWaitsSchemaModule from './nhs-waits-schema.js';
import privateCostsSchemaModule from './private-costs-schema.js';
import clinicsSchemaModule from './clinics-schema.js';
import treatmentConnectSchemaModule from './treatmentconnect-schema.js';

/**
 * NHS Waiting Times schema and prompt generator
 */
export const nhsWaitsSchema = nhsWaitsSchemaModule.schema;
export const getNHSWaitsPrompt = nhsWaitsSchemaModule.getPrompt;

/**
 * Private Costs schema and prompt generator
 */
export const privateCostsSchema = privateCostsSchemaModule.schema;
export const getPrivateCostsPrompt = privateCostsSchemaModule.getPrompt;

/**
 * Clinics schema and prompt generator
 */
export const clinicsSchema = clinicsSchemaModule.schema;
export const getClinicsPrompt = clinicsSchemaModule.getPrompt;

/**
 * TreatmentConnect schema and prompt generator
 */
export const treatmentConnectSchema = treatmentConnectSchemaModule.schema;
export const getTreatmentConnectPrompt = treatmentConnectSchemaModule.getPrompt;

/**
 * All schemas as a single object for easy access
 */
export const schemas = {
  nhsWaits: {
    schema: nhsWaitsSchema,
    getPrompt: getNHSWaitsPrompt
  },
  privateCosts: {
    schema: privateCostsSchema,
    getPrompt: getPrivateCostsPrompt
  },
  clinics: {
    schema: clinicsSchema,
    getPrompt: getClinicsPrompt
  },
  treatmentConnect: {
    schema: treatmentConnectSchema,
    getPrompt: getTreatmentConnectPrompt
  }
};

export default schemas;

