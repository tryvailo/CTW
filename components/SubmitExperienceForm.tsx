'use client';

import React, { useState, useEffect } from 'react';
import type { SubmissionFormData, ProcedureSubmission, LocationSubmission, NHSOrPrivate } from '@/lib/types/submissions';
import {
  validateSubmission,
  prepareSubmissionData,
  submitPatientExperience,
  calculateWaitWeeks,
  checkDuplicate,
} from '@/lib/services/submissions';
import { SuccessStates } from './SuccessStates';

interface SubmitExperienceFormProps {
  variant?: 'full' | 'compact' | 'modal';
  defaultProcedure?: ProcedureSubmission;
  defaultLocation?: LocationSubmission;
  onSuccess?: (submissionId: string) => void;
}

const PROCEDURE_OPTIONS: Array<{ value: ProcedureSubmission; label: string }> = [
  { value: 'cataract', label: 'Cataract Surgery' },
  { value: 'hip', label: 'Hip Replacement' },
  { value: 'knee', label: 'Knee Replacement' },
];

const LOCATION_OPTIONS: Array<{ value: LocationSubmission; label: string }> = [
  { value: 'london', label: 'London' },
  { value: 'manchester', label: 'Manchester' },
  { value: 'birmingham', label: 'Birmingham' },
  { value: 'leeds', label: 'Leeds' },
  { value: 'bristol', label: 'Bristol' },
];

export const SubmitExperienceForm: React.FC<SubmitExperienceFormProps> = ({
  variant = 'full',
  defaultProcedure,
  defaultLocation,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<SubmissionFormData>({
    procedure: defaultProcedure || '',
    location: defaultLocation || '',
    booking_date: '',
    surgery_date: '',
    nhs_or_private: '',
    cancellations: 0,
    satisfaction: 0,
    comments: '',
    agree_to_publish: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [waitWeeks, setWaitWeeks] = useState<number | null>(null);

  // Calculate wait weeks when dates change
  useEffect(() => {
    if (formData.booking_date && formData.surgery_date) {
      const weeks = calculateWaitWeeks(formData.booking_date, formData.surgery_date);
      setWaitWeeks(weeks >= 0 ? weeks : null);
    } else {
      setWaitWeeks(null);
    }
  }, [formData.booking_date, formData.surgery_date]);

  const handleChange = (
    field: keyof SubmissionFormData,
    value: string | number | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validateSubmission(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    // Check for duplicates
    const isDuplicate = await checkDuplicate(formData.booking_date, formData.surgery_date);
    if (isDuplicate) {
      setErrors({
        general: 'A similar submission already exists. Thank you for your contribution!',
      });
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const submissionData = prepareSubmissionData(formData);
      const result = await submitPatientExperience(submissionData);

      if (result.success && result.id) {
        setSubmittedId(result.id);
        if (onSuccess) {
          onSuccess(result.id);
        }
      } else {
        setErrors({ general: result.error || 'Failed to submit. Please try again.' });
      }
    } catch (error) {
      setErrors({
        general: error instanceof Error ? error.message : 'An error occurred. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show success state
  if (submittedId) {
    return (
      <SuccessStates
        submission={formData}
        waitWeeks={waitWeeks || 0}
        submissionId={submittedId}
      />
    );
  }

  // Compact variant
  if (variant === 'compact') {
    return (
      <div className="bg-elderly-primary-light border-elderly border-elderly-gray-medium p-6 rounded-lg">
        <p className="text-elderly-base text-elderly-text mb-4">
          Help improve our data: <strong>3,214</strong> patients have shared their experiences.
        </p>
        <a
          href="#submit-experience"
          className="inline-block text-elderly-primary underline hover:text-elderly-primary-dark font-semibold text-elderly-base"
        >
          Submit your experience →
        </a>
      </div>
    );
  }

  // Full form
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border-elderly border-elderly-gray-medium p-6 rounded-lg shadow-sm"
      aria-labelledby="submit-experience-heading"
      id="submit-experience"
    >
      <h2
        id="submit-experience-heading"
        className="text-elderly-xl font-bold text-elderly-primary mb-6"
      >
        Share Your Experience
      </h2>
      <p className="text-elderly-sm text-elderly-text mb-6">
        Help others make informed decisions. Your anonymised experience will help thousands of people.
        Takes 5 minutes.
      </p>

      {errors.general && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
          <p className="text-elderly-sm text-red-800">{errors.general}</p>
        </div>
      )}

      <div className="space-y-6">
        {/* Procedure */}
        <div>
          <label htmlFor="procedure" className="block text-elderly-base font-semibold text-elderly-text mb-2">
            Procedure <span className="text-red-600">*</span>
          </label>
          <select
            id="procedure"
            value={formData.procedure}
            onChange={(e) => handleChange('procedure', e.target.value)}
            className={`w-full p-3 border-elderly border-elderly-gray-medium rounded-lg text-elderly-base ${
              errors.procedure ? 'border-red-500' : ''
            }`}
            aria-required="true"
            aria-invalid={!!errors.procedure}
            aria-describedby={errors.procedure ? 'procedure-error' : undefined}
          >
            <option value="">Select a procedure</option>
            {PROCEDURE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {errors.procedure && (
            <p id="procedure-error" className="mt-1 text-elderly-xs text-red-600">
              {errors.procedure}
            </p>
          )}
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-elderly-base font-semibold text-elderly-text mb-2">
            Location <span className="text-red-600">*</span>
          </label>
          <select
            id="location"
            value={formData.location}
            onChange={(e) => handleChange('location', e.target.value)}
            className={`w-full p-3 border-elderly border-elderly-gray-medium rounded-lg text-elderly-base ${
              errors.location ? 'border-red-500' : ''
            }`}
            aria-required="true"
            aria-invalid={!!errors.location}
            aria-describedby={errors.location ? 'location-error' : undefined}
          >
            <option value="">Select a location</option>
            {LOCATION_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {errors.location && (
            <p id="location-error" className="mt-1 text-elderly-xs text-red-600">
              {errors.location}
            </p>
          )}
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="booking_date" className="block text-elderly-base font-semibold text-elderly-text mb-2">
              When did you book? <span className="text-red-600">*</span>
            </label>
            <input
              type="date"
              id="booking_date"
              value={formData.booking_date}
              onChange={(e) => handleChange('booking_date', e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className={`w-full p-3 border-elderly border-elderly-gray-medium rounded-lg text-elderly-base ${
                errors.booking_date ? 'border-red-500' : ''
              }`}
              aria-required="true"
              aria-invalid={!!errors.booking_date}
              aria-describedby={errors.booking_date ? 'booking-error' : undefined}
            />
            {errors.booking_date && (
              <p id="booking-error" className="mt-1 text-elderly-xs text-red-600">
                {errors.booking_date}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="surgery_date" className="block text-elderly-base font-semibold text-elderly-text mb-2">
              When did you have surgery? <span className="text-red-600">*</span>
            </label>
            <input
              type="date"
              id="surgery_date"
              value={formData.surgery_date}
              onChange={(e) => handleChange('surgery_date', e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className={`w-full p-3 border-elderly border-elderly-gray-medium rounded-lg text-elderly-base ${
                errors.surgery_date ? 'border-red-500' : ''
              }`}
              aria-required="true"
              aria-invalid={!!errors.surgery_date}
              aria-describedby={errors.surgery_date ? 'surgery-error' : undefined}
            />
            {errors.surgery_date && (
              <p id="surgery-error" className="mt-1 text-elderly-xs text-red-600">
                {errors.surgery_date}
              </p>
            )}
          </div>
        </div>

        {/* Calculated wait time */}
        {waitWeeks !== null && waitWeeks >= 0 && (
          <div className="p-4 bg-blue-50 border border-blue-300 rounded-lg">
            <p className="text-elderly-sm text-blue-800">
              <strong>Total wait:</strong> {waitWeeks} week{waitWeeks !== 1 ? 's' : ''}
            </p>
          </div>
        )}

        {/* NHS or Private */}
        <div>
          <fieldset>
            <legend className="block text-elderly-base font-semibold text-elderly-text mb-2">
              NHS or Private? <span className="text-red-600">*</span>
            </legend>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="nhs_or_private"
                  value="nhs"
                  checked={formData.nhs_or_private === 'nhs'}
                  onChange={(e) => handleChange('nhs_or_private', e.target.value)}
                  className="w-5 h-5"
                  aria-required="true"
                />
                <span className="text-elderly-base text-elderly-text">NHS</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="nhs_or_private"
                  value="private"
                  checked={formData.nhs_or_private === 'private'}
                  onChange={(e) => handleChange('nhs_or_private', e.target.value)}
                  className="w-5 h-5"
                  aria-required="true"
                />
                <span className="text-elderly-base text-elderly-text">Private</span>
              </label>
            </div>
            {errors.nhs_or_private && (
              <p className="mt-1 text-elderly-xs text-red-600">{errors.nhs_or_private}</p>
            )}
          </fieldset>
        </div>

        {/* Cancellations */}
        <div>
          <label htmlFor="cancellations" className="block text-elderly-base font-semibold text-elderly-text mb-2">
            How many times was your surgery cancelled?
          </label>
          <select
            id="cancellations"
            value={formData.cancellations}
            onChange={(e) => handleChange('cancellations', parseInt(e.target.value, 10))}
            className="w-full p-3 border-elderly border-elderly-gray-medium rounded-lg text-elderly-base"
          >
            <option value={0}>0</option>
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3+</option>
          </select>
        </div>

        {/* Satisfaction */}
        <div>
          <label className="block text-elderly-base font-semibold text-elderly-text mb-3">
            How satisfied were you with the experience?
          </label>
          <div className="flex items-center gap-3">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                type="button"
                onClick={() => handleChange('satisfaction', rating)}
                className={`text-4xl focus:outline-none focus:ring-2 focus:ring-elderly-primary focus:ring-offset-2 rounded transition-colors ${
                  formData.satisfaction >= rating ? 'text-yellow-400' : 'text-gray-300'
                }`}
                aria-label={`Rate ${rating} out of 5`}
                aria-pressed={formData.satisfaction >= rating}
              >
                ★
              </button>
            ))}
            {formData.satisfaction > 0 && (
              <span className="text-elderly-base text-elderly-text ml-3 font-semibold">
                {formData.satisfaction}/5
              </span>
            )}
          </div>
        </div>

        {/* Comments */}
        <div>
          <label htmlFor="comments" className="block text-elderly-base font-semibold text-elderly-text mb-2">
            Any comments?
          </label>
          <p className="text-elderly-xs text-elderly-gray-dark mb-2">
            What would you like others to know?
          </p>
          <textarea
            id="comments"
            value={formData.comments}
            onChange={(e) => handleChange('comments', e.target.value)}
            rows={4}
            className="w-full p-3 border-elderly border-elderly-gray-medium rounded-lg text-elderly-base"
            placeholder="Optional: Share any helpful details about your experience..."
          />
        </div>

        {/* Agreement */}
        <div>
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.agree_to_publish}
              onChange={(e) => handleChange('agree_to_publish', e.target.checked)}
              className="mt-1 w-5 h-5 flex-shrink-0"
              aria-required="true"
              aria-invalid={!!errors.agree_to_publish}
            />
            <span className="text-elderly-sm text-elderly-text">
              I agree my anonymised data can be published{' '}
              <span className="text-red-600">*</span>
            </span>
          </label>
          {errors.agree_to_publish && (
            <p className="mt-1 text-elderly-xs text-red-600">{errors.agree_to_publish}</p>
          )}
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting...' : 'Submit my experience'}
        </button>

        <p className="text-elderly-xs text-elderly-gray-dark text-center">
          No obligation, no judgement. Your experience matters.
        </p>
      </div>
    </form>
  );
};

