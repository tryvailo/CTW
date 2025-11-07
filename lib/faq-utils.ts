/**
 * FAQ utility functions
 * These functions work on both client and server side
 */

import type { FAQItem } from './types';

/**
 * Group FAQ items by topic for better readability
 */
export function groupFAQItems(items: FAQItem[]): Array<{ title: string; items: FAQItem[] }> {
  const groups: Array<{ title: string; items: FAQItem[] }> = [];
  
  // Keywords for grouping
  const aboutProcedureKeywords = ['can i get', 'what type of', 'is the surgery', 'is it painful', 'anaesthetic', 'both eyes', 'partial or total'];
  const recoveryKeywords = ['recovery', 'healing', 'improve', 'return to', 'can i kneel', 'walking', 'driving'];
  const risksKeywords = ['risks', 'complications', 'last', 'longevity', 'metal detector'];
  const generalKeywords = ['afford', 'choose', 'referral', 'switch', 'cancelled', 'insurance'];
  
  const aboutProcedure: FAQItem[] = [];
  const recovery: FAQItem[] = [];
  const risks: FAQItem[] = [];
  const general: FAQItem[] = [];
  const other: FAQItem[] = [];
  
  items.forEach(item => {
    const lowerQuestion = item.question.toLowerCase();
    
    if (aboutProcedureKeywords.some(keyword => lowerQuestion.includes(keyword))) {
      aboutProcedure.push(item);
    } else if (recoveryKeywords.some(keyword => lowerQuestion.includes(keyword))) {
      recovery.push(item);
    } else if (risksKeywords.some(keyword => lowerQuestion.includes(keyword))) {
      risks.push(item);
    } else if (generalKeywords.some(keyword => lowerQuestion.includes(keyword))) {
      general.push(item);
    } else {
      other.push(item);
    }
  });
  
  if (aboutProcedure.length > 0) {
    groups.push({ title: 'About the Procedure', items: aboutProcedure });
  }
  if (recovery.length > 0) {
    groups.push({ title: 'Recovery & Aftercare', items: recovery });
  }
  if (risks.length > 0) {
    groups.push({ title: 'Risks & Longevity', items: risks });
  }
  if (general.length > 0) {
    groups.push({ title: 'General Questions', items: general });
  }
  if (other.length > 0) {
    groups.push({ title: 'Other Questions', items: other });
  }
  
  return groups;
}

