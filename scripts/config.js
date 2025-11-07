/**
 * Configuration for healthcare data scraping
 * Maps procedures, cities, NHS trusts, and validation rules
 */

export const config = {
  // Procedure Mapping
  procedures: {
    cataract: {
      nhs_specialty: 'Ophthalmology',
      phin_name: 'Cataract surgery',
      keywords: ['cataract', 'eye', 'lens', 'ophth'],
      synonyms: ['cataract extraction', 'phacoemulsification', 'lens extraction']
    },
    hip: {
      nhs_specialty: 'Orthopaedics',
      phin_name: 'Hip replacement',
      keywords: ['hip', 'total hip', 'tha', 'hip arthroplasty'],
      synonyms: ['hip replacement', 'total hip replacement', 'hip repair', 'THR']
    },
    knee: {
      nhs_specialty: 'Orthopaedics',
      phin_name: 'Knee replacement',
      keywords: ['knee', 'total knee', 'tkr', 'knee arthroplasty'],
      synonyms: ['knee replacement', 'total knee replacement', 'knee repair', 'TKR']
    }
  },

  // City to NHS Trust Mapping
  cities: {
    london: {
      trusts: [
        'Moorfields NHS Trust', // Eye specialist
        'Guy\'s and St Thomas\' NHS Foundation Trust',
        'Royal Free London NHS Foundation Trust',
        'Imperial College Healthcare NHS Trust',
        'Barts Health NHS Trust'
      ],
      postcodes: ['SW', 'EC', 'E', 'N', 'W', 'SE', 'NW'],
      phin_location: 'London'
    },
    manchester: {
      trusts: [
        'Manchester Royal Eye Hospital NHS Foundation Trust',
        'Central Manchester University Hospitals NHS Foundation Trust',
        'Manchester University NHS Foundation Trust'
      ],
      postcodes: ['M'],
      phin_location: 'Manchester'
    },
    birmingham: {
      trusts: [
        'University Hospitals Birmingham NHS Foundation Trust',
        'Royal Orthopaedic Hospital NHS Foundation Trust',
        'Birmingham Women\'s and Children\'s NHS Foundation Trust'
      ],
      postcodes: ['B'],
      phin_location: 'Birmingham'
    },
    leeds: {
      trusts: [
        'Leeds Teaching Hospitals NHS Trust'
      ],
      postcodes: ['LS'],
      phin_location: 'Leeds'
    },
    bristol: {
      trusts: [
        'University Hospitals Bristol and Weston NHS Foundation Trust'
      ],
      postcodes: ['BS'],
      phin_location: 'Bristol'
    }
  },

  // URLs
  urls: {
    nhs_wait_times: 'https://www.myplannedcare.nhs.uk/',
    phin_provider: 'https://www.phin.org.uk/independent-provider-finder/',
    phin_home: 'https://www.phin.org.uk/',
    // TreatmentConnect (PRIMARY source for private costs)
    treatmentconnect_base: 'https://www.treatmentconnect.co.uk',
    treatmentconnect_pattern: 'https://www.treatmentconnect.co.uk/hospitals/{hospital}/{procedure}',
    // Direct clinic sites (for validation)
    spire_base: 'https://www.spirehealthcare.com',
    nuffield_base: 'https://www.nuffieldhealth.com',
    circle_base: 'https://www.circlehealthgroup.co.uk',
    ramsay_base: 'https://www.ramsayhealth.co.uk'
  },
  
  // TreatmentConnect procedure slugs mapping
  treatmentconnect_procedures: {
    cataract: 'cataract-surgery',
    hip: 'hip-replacement',
    knee: 'knee-replacement'
  },

  // Scraping Options
  scraping: {
    timeout: 30000, // 30 seconds
    rate_limit_delay: 6000, // 6 seconds between requests
    max_retries: 2,
    cities: ['London', 'Manchester', 'Birmingham', 'Leeds', 'Bristol'],
    procedures: ['cataract', 'hip', 'knee']
  },

  // Data Validation Rules
  validation: {
    min_wait_weeks: 0,
    max_wait_weeks: 100,
    min_cost_gbp: 100,
    max_cost_gbp: 50000,
    valid_phone_patterns: ['+44', '020', '0121', '0161', '0117', '0113']
  },

  // CSV File Paths
  csvPaths: {
    nhs_waits: 'public/data/nhs_waits.csv',
    private_costs: 'public/data/private_costs.csv',
    clinics: 'public/data/clinics.csv'
  }
};

export default config;

