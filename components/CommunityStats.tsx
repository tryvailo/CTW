'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import type { CommunityStats as CommunityStatsType } from '@/lib/types/submissions';
import { getCommunityStats } from '@/lib/services/submissions';
import { SubmitExperienceForm } from './SubmitExperienceForm';

interface CommunityStatsComponentProps {
  showForm?: boolean;
}

export const CommunityStats: React.FC<CommunityStatsComponentProps> = ({ showForm = false }) => {
  const [stats, setStats] = useState<CommunityStatsType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await getCommunityStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to load community stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="bg-elderly-primary-light border-elderly border-elderly-gray-medium p-6 rounded-lg">
        <p className="text-elderly-base text-elderly-text">Loading community statistics...</p>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <section
      className="bg-white border-elderly border-elderly-gray-medium p-6 rounded-lg shadow-sm mb-6"
      aria-labelledby="community-stats-heading"
    >
      <h2
        id="community-stats-heading"
        className="text-elderly-xl font-bold text-elderly-primary mb-6"
      >
        📊 Community Impact
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Stats Grid */}
        <div className="space-y-4">
          <div className="p-5 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-elderly-sm text-elderly-gray-dark mb-2">Stories this month</p>
            <p className="text-elderly-2xl font-bold text-blue-700">
              {stats.stories_this_month.toLocaleString()}{' '}
              <span className="text-green-600 text-elderly-base" aria-label="Trending up">
                ⬆️
              </span>
            </p>
            <p className="text-elderly-xs text-blue-600 mt-2">(trending)</p>
          </div>

          <div className="p-5 bg-green-50 rounded-lg border border-green-200">
            <p className="text-elderly-sm text-elderly-gray-dark mb-2">Total contributors</p>
            <p className="text-elderly-2xl font-bold text-green-700">
              {stats.total_contributors.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-5 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-elderly-sm text-elderly-gray-dark mb-2">Most common wait</p>
            <p className="text-elderly-lg font-bold text-yellow-700 mb-1">
              {stats.most_common_wait.procedure}
            </p>
            <p className="text-elderly-base text-yellow-800">
              {stats.most_common_wait.weeks} weeks
            </p>
          </div>

          <div className="p-5 bg-purple-50 rounded-lg border border-purple-200">
            <p className="text-elderly-sm text-elderly-gray-dark mb-2">Fastest procedure</p>
            <p className="text-elderly-lg font-bold text-purple-700 mb-1">
              {stats.fastest_procedure.procedure}
            </p>
            <p className="text-elderly-sm text-purple-800">
              {stats.fastest_procedure.location}: {stats.fastest_procedure.weeks} weeks
            </p>
          </div>
        </div>
      </div>

      {/* Slowest wait */}
      <div className="mb-6 p-5 bg-orange-50 rounded-lg border border-orange-200">
        <p className="text-elderly-sm text-elderly-gray-dark mb-2">Slowest wait reported</p>
        <p className="text-elderly-base font-bold text-orange-700">
          {stats.slowest_wait.procedure} in {stats.slowest_wait.location}:{' '}
          {stats.slowest_wait.weeks} weeks
        </p>
      </div>

      {/* Data gaps */}
      {stats.data_gaps.length > 0 && (
        <div className="mb-6 p-5 bg-red-50 rounded-lg border-l-4 border-red-500">
          <p className="text-elderly-base font-semibold text-red-800 mb-3">
            ⚠️ Biggest gaps in data:
          </p>
          <ul className="space-y-2">
            {stats.data_gaps.map((gap, index) => (
              <li key={index} className="text-elderly-sm text-red-700">
                <strong>{gap.procedure}</strong> in <strong>{gap.location}</strong> (need{' '}
                {gap.needed} more)
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* CTA */}
      <div className="pt-6 border-t border-elderly-gray-medium">
        <p className="text-elderly-base text-elderly-text mb-4 text-center">
          Help us complete the picture
        </p>
        {showForm ? (
          <SubmitExperienceForm />
        ) : (
          <div className="text-center">
            <Link
              href="#submit-experience"
              className="btn-primary inline-block"
            >
              Submit your story
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

