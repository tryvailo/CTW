interface LastUpdatedProps {
  date: string;
  source?: string;
}

export const LastUpdated: React.FC<LastUpdatedProps> = ({ date, source }) => {
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="mb-6">
      <p className="text-elderly-sm text-elderly-gray-dark">
        Last updated: {formatDate(date)}
        {source && ` • Data refreshed ${source === 'weekly' ? 'biweekly' : source}`}
      </p>
    </div>
  );
};

