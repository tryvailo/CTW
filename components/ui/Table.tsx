import React from 'react';

interface TableProps {
  children: React.ReactNode;
  className?: string;
}

export const Table: React.FC<TableProps> = ({ children, className = '' }) => {
  return (
    <div className="overflow-x-auto mb-8">
      <table className={`comparison-table ${className}`}>
        {children}
      </table>
    </div>
  );
};

interface TableHeaderProps {
  children: React.ReactNode;
}

export const TableHeader: React.FC<TableHeaderProps> = ({ children }) => {
  return <thead>{children}</thead>;
};

interface TableBodyProps {
  children: React.ReactNode;
}

export const TableBody: React.FC<TableBodyProps> = ({ children }) => {
  return <tbody>{children}</tbody>;
};

interface TableRowProps {
  children: React.ReactNode;
  className?: string;
}

export const TableRow: React.FC<TableRowProps> = ({ children, className = '' }) => {
  return <tr className={className}>{children}</tr>;
};

interface TableCellProps {
  children: React.ReactNode;
  isHeader?: boolean;
  colSpan?: number;
  className?: string;
}

export const TableCell: React.FC<TableCellProps> = ({
  children,
  isHeader = false,
  colSpan,
  className = '',
}) => {
  const Cell = isHeader ? 'th' : 'td';
  return (
    <Cell colSpan={colSpan} className={className}>
      {children}
    </Cell>
  );
};

