'use client';

import React, { useState } from 'react';
import type { ProcedureId } from '@/lib/types/waitingTimes';
import type { RegionalComparisonData, RegionalWaitTime } from '@/lib/utils/regionComparison';
import { 
  getRegionPerformanceColor,
  getConfidenceInfo,
} from '@/lib/utils/regionComparison';
import { RegionalSavingsCalculator } from './RegionalSavingsCalculator';

interface RegionalVariationComparisonProps {
  data: Record<ProcedureId, RegionalComparisonData | null> | RegionalComparisonData | null;
  procedure?: ProcedureId;
  format?: 'table' | 'map' | 'both';
  interactive?: boolean;
  showAllProcedures?: boolean;
}

export const RegionalVariationComparison: React.FC<RegionalVariationComparisonProps> = ({
  data,
  procedure,
  format = 'both',
  interactive = true,
  showAllProcedures = false,
}) => {
  const [selectedFromRegion, setSelectedFromRegion] = useState<RegionalWaitTime | null>(null);
  const [selectedToRegion, setSelectedToRegion] = useState<RegionalWaitTime | null>(null);
  const [hoveredRegion, setHoveredRegion] = useState<RegionalWaitTime | null>(null);

  // Normalize data format
  let displayData: Record<ProcedureId, RegionalComparisonData | null> | null = null;
  let singleProcedureData: RegionalComparisonData | null = null;

  if (showAllProcedures) {
    displayData = data as Record<ProcedureId, RegionalComparisonData | null>;
  } else if (procedure && !Array.isArray(data) && data && 'procedure' in data) {
    singleProcedureData = data as RegionalComparisonData;
    displayData = { 
      cataract: null,
      hip: null,
      knee: null,
      [procedure]: singleProcedureData 
    };
  }

  if (!displayData) {
    return (
      <div className="bg-elderly-primary-light border-elderly border-elderly-gray-medium p-6 rounded-lg">
        <p className="text-elderly-base text-elderly-text">
          Regional comparison data not available.
        </p>
      </div>
    );
  }

  const handleRegionClick = (region: RegionalWaitTime) => {
    if (!interactive) return;

    if (!selectedFromRegion) {
      setSelectedFromRegion(region);
    } else if (selectedFromRegion.regionId === region.regionId) {
      // Deselect if clicking same region
      setSelectedFromRegion(null);
      setSelectedToRegion(null);
    } else {
      setSelectedToRegion(region);
    }
  };

  const handleRegionHover = (region: RegionalWaitTime | null) => {
    if (interactive) {
      setHoveredRegion(region);
    }
  };

  // Render table
  const renderTable = (data: RegionalComparisonData) => {
    const { regions, procedureName } = data;
    
    return (
      <div className="overflow-x-auto mb-6">
        <table 
          className="w-full border-collapse text-elderly-sm"
          aria-label={`Regional wait times comparison for ${procedureName}`}
        >
          <thead>
            <tr className="bg-elderly-primary-light border-b-2 border-elderly-primary">
              <th className="p-4 text-left font-bold text-elderly-primary">Region</th>
              <th className="p-4 text-center font-bold text-elderly-primary">Wait Time</th>
              <th className="p-4 text-center font-bold text-elderly-primary">Confidence</th>
            </tr>
          </thead>
          <tbody>
            {regions.map((region) => {
              const confidenceInfo = getConfidenceInfo(region.confidence, region.sampleSize);
              const performance = getRegionPerformanceColor(region, regions);
              const isSelected = selectedFromRegion?.regionId === region.regionId || 
                                selectedToRegion?.regionId === region.regionId;
              const isHovered = hoveredRegion?.regionId === region.regionId;

              return (
                <tr
                  key={region.regionId}
                  className={`
                    border-b border-elderly-gray-medium
                    ${isSelected ? 'bg-blue-50' : isHovered ? 'bg-gray-50' : ''}
                    ${interactive ? 'cursor-pointer hover:bg-gray-50' : ''}
                    transition-colors
                  `}
                  onClick={() => handleRegionClick(region)}
                  onMouseEnter={() => handleRegionHover(region)}
                  onMouseLeave={() => handleRegionHover(null)}
                  role={interactive ? 'button' : undefined}
                  tabIndex={interactive ? 0 : undefined}
                  onKeyDown={interactive ? (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleRegionClick(region);
                    }
                  } : undefined}
                  aria-label={`${region.regionName}: ${region.recommendedDisplay}`}
                >
                  <td className="p-4 font-semibold">
                    <div className="flex items-center gap-2">
                      {region.regionName}
                      {region.hasFastTrack && (
                        <span className="text-yellow-600 text-base" aria-label="Fast-track centre available">
                          ✨
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`font-bold ${performance.color}`}>
                      {region.recommendedDisplay}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <div 
                      className="flex items-center justify-center gap-2"
                      title={confidenceInfo.tooltip}
                    >
                      <span className={confidenceInfo.color} aria-label={confidenceInfo.label}>
                        {confidenceInfo.icon}
                      </span>
                      <span className="text-elderly-xs text-elderly-gray-dark">
                        {region.sampleSize} sample{region.sampleSize !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  // Render simple map (visual representation)
  const renderMap = (data: RegionalComparisonData) => {
    const { regions } = data;
    
    // Simple grid-based map representation
    const regionPositions: Record<string, { row: number; col: number }> = {
      london: { row: 1, col: 2 },
      manchester: { row: 2, col: 1 },
      birmingham: { row: 2, col: 2 },
      leeds: { row: 2, col: 3 },
      bristol: { row: 3, col: 2 },
    };

    return (
      <div className="mb-6">
        <h3 className="text-elderly-lg font-bold text-elderly-primary mb-4">
          Regional Performance Map
        </h3>
        <div className="grid grid-cols-3 gap-2 max-w-md mx-auto">
          {regions.map((region) => {
            const performance = getRegionPerformanceColor(region, regions);
            const confidenceInfo = getConfidenceInfo(region.confidence, region.sampleSize);
            const pos = regionPositions[region.regionId] || { row: 1, col: 1 };
            const isSelected = selectedFromRegion?.regionId === region.regionId || 
                              selectedToRegion?.regionId === region.regionId;
            const isHovered = hoveredRegion?.regionId === region.regionId;

            return (
              <button
                key={region.regionId}
                className={`
                  p-4 rounded-lg border-2 transition-all
                  ${performance.bgColor}
                  ${isSelected ? 'border-blue-500 ring-2 ring-blue-300' : 'border-gray-300'}
                  ${isHovered ? 'scale-105 shadow-lg' : ''}
                  ${interactive ? 'cursor-pointer hover:shadow-md' : ''}
                  ${confidenceInfo.opacity}
                `}
                onClick={() => handleRegionClick(region)}
                onMouseEnter={() => handleRegionHover(region)}
                onMouseLeave={() => handleRegionHover(null)}
                style={{ gridRow: pos.row, gridColumn: pos.col }}
                aria-label={`${region.regionName}: ${region.recommendedDisplay}`}
                title={`${region.regionName}: ${region.recommendedDisplay}. ${confidenceInfo.tooltip}`}
              >
                <div className="text-center">
                  <p className={`font-bold text-elderly-sm ${performance.color} mb-1`}>
                    {region.regionName}
                  </p>
                  <p className="text-elderly-xs font-semibold mb-1">
                    {region.recommendedDisplay}
                  </p>
                  {region.hasFastTrack && (
                    <span className="text-yellow-600 text-xs" aria-label="Fast-track available">
                      ✨
                    </span>
                  )}
                  <div className="mt-1">
                    <span className={confidenceInfo.color} aria-label={confidenceInfo.label}>
                      {confidenceInfo.icon}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        {interactive && (
          <div className="mt-4 text-center">
            <p className="text-elderly-xs text-elderly-gray-dark">
              Click on regions to compare wait times
            </p>
          </div>
        )}
      </div>
    );
  };

  // Render all procedures table
  const renderAllProceduresTable = () => {
    if (!displayData) return null;
    
    const procedures: ProcedureId[] = ['cataract', 'hip', 'knee'];
    const procedureNames = {
      cataract: 'Cataract',
      hip: 'Hip',
      knee: 'Knee',
    };

    return (
      <div className="overflow-x-auto mb-6">
        <table 
          className="w-full border-collapse text-elderly-sm"
          aria-label="Regional wait times comparison for all procedures"
        >
          <thead>
            <tr className="bg-elderly-primary-light border-b-2 border-elderly-primary">
              <th className="p-4 text-left font-bold text-elderly-primary">Region</th>
              {procedures.map(proc => (
                <th key={proc} className="p-4 text-center font-bold text-elderly-primary">
                  {procedureNames[proc]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {['london', 'manchester', 'birmingham', 'leeds', 'bristol'].map((regionId) => {
              const regionName = displayData?.cataract?.regions.find(r => r.regionId === regionId)?.regionName || regionId;
              
              return (
                <tr key={regionId} className="border-b border-elderly-gray-medium">
                  <td className="p-4 font-semibold">
                    <div className="flex items-center gap-2">
                      {regionName}
                      {displayData?.cataract?.regions.find(r => r.regionId === regionId)?.hasFastTrack && (
                        <span className="text-yellow-600 text-base" aria-label="Fast-track centre available">
                          ✨
                        </span>
                      )}
                    </div>
                  </td>
                  {procedures.map(proc => {
                    const procData = displayData?.[proc];
                    const region = procData?.regions.find(r => r.regionId === regionId);
                    if (!region || !procData) {
                      return <td key={proc} className="p-4 text-center text-gray-400">N/A</td>;
                    }
                    const performance = getRegionPerformanceColor(
                      region, 
                      procData.regions
                    );
                    return (
                      <td key={proc} className="p-4 text-center">
                        <span className={`font-semibold ${performance.color}`}>
                          {region.recommendedDisplay}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <section 
      className="bg-white border-elderly border-elderly-gray-medium p-6 rounded-lg shadow-sm mb-6"
      aria-labelledby="regional-variation-heading"
    >
      <h2 
        id="regional-variation-heading"
        className="text-elderly-xl font-bold text-elderly-primary mb-6"
      >
        Regional Variation: Wait Times Across UK
      </h2>

      {showAllProcedures ? (
        <>
          {renderAllProceduresTable()}
          <p className="text-elderly-xs text-elderly-gray-dark mb-4">
            ✨ indicates fast-track centres (ACES) available
          </p>
        </>
      ) : (
        <>
          {/* Single procedure view */}
          {singleProcedureData && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {format === 'table' || format === 'both' ? (
                  <div>
                    <h3 className="text-elderly-lg font-bold text-elderly-primary mb-4">
                      {singleProcedureData.procedureName} by Region
                    </h3>
                    {renderTable(singleProcedureData)}
                  </div>
                ) : null}
                
                {format === 'map' || format === 'both' ? (
                  <div>
                    {renderMap(singleProcedureData)}
                  </div>
                ) : null}
              </div>

              {/* Savings Calculator */}
              {interactive && selectedFromRegion && selectedToRegion && (
                <div className="mt-6">
                  <RegionalSavingsCalculator
                    fromRegion={selectedFromRegion}
                    toRegion={selectedToRegion}
                    procedureName={singleProcedureData.procedureName}
                    procedureId={singleProcedureData.procedure}
                  />
                </div>
              )}

              {/* Instructions */}
              {interactive && !selectedFromRegion && (
                <div className="mt-6 p-4 bg-elderly-primary-light rounded-lg">
                  <p className="text-elderly-sm text-elderly-text">
                    <strong>Tip:</strong> Click on a region in the table or map to select it, then click another to compare wait times and see potential savings.
                  </p>
                </div>
              )}
            </>
          )}
        </>
      )}
    </section>
  );
};

