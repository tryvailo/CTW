/**
 * TreatmentConnect.co.uk Configuration
 * External configuration file for TreatmentConnect source
 */

export const treatmentConnectConfig = {
  // Base URL
  base_url: 'https://www.treatmentconnect.co.uk',
  
  // URL Pattern template
  url_pattern: 'https://www.treatmentconnect.co.uk/hospitals/{hospital}/{procedure}',
  
  // Procedure name mapping (internal ID -> TreatmentConnect slug)
  procedure_slugs: {
    cataract: 'cataract-surgery',
    hip: 'hip-replacement',
    knee: 'knee-replacement'
  },
  
  // Source metadata
  source_name: 'TreatmentConnect',
  source_type: 'aggregator',
  source_priority: 1, // Primary source (highest priority)
  
  // Data extraction settings
  extraction: {
    // Fields to extract from TreatmentConnect pages
    fields: [
      'hospital_name',
      'procedure_name',
      'price_gbp',
      'price_min_gbp',
      'price_max_gbp',
      'city',
      'rating_stars',
      'rating_count',
      'avg_uk_price',
      'price_range_uk_min',
      'price_range_uk_max'
    ],
    
    // Price extraction rules
    price_rules: {
      // Convert "£2,500" to 2500
      remove_currency_symbol: true,
      remove_commas: true,
      
      // Handle "From £X" prices
      from_price_as_min: true,
      
      // Handle price ranges
      extract_range: true
    }
  },
  
  // Validation rules specific to TreatmentConnect
  validation: {
    // Expected price ranges per procedure
    price_ranges: {
      cataract: { min: 1500, max: 5000 },
      hip: { min: 9000, max: 20000 },
      knee: { min: 9000, max: 20000 }
    },
    
    // Required fields
    required_fields: ['hospital_name', 'procedure_name', 'price_gbp', 'city']
  }
};

export default treatmentConnectConfig;

