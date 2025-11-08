/**
 * Client-side utility for confidence level display
 */

export function getConfidenceDisplay(confidence: string): {
  label: string;
  icon: string;
  color: string;
} {
  switch (confidence) {
    case 'high':
      return { label: 'High confidence', icon: '✅', color: 'text-green-600' };
    case 'medium':
      return { label: 'Medium confidence', icon: '✅', color: 'text-yellow-600' };
    case 'low':
      return { label: 'Low confidence', icon: '⚠️', color: 'text-orange-600' };
    case 'very_low':
      return { label: 'Very low confidence', icon: '⚠️', color: 'text-orange-600' };
    case 'no_data':
      return { label: 'No data available', icon: '❌', color: 'text-gray-500' };
    default:
      return { label: 'Unknown', icon: '❓', color: 'text-gray-500' };
  }
}

