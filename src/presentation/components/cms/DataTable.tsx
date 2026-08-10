import { cn } from "@/lib/cn";

export interface TableColumn<T> {
  key: string;
  header: string;
  render: (row: T) => React.ReactNode;
  className?: string;
  hideOnSmall?: boolean;
}

interface DataTableProps<T> {
  columns: TableColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
}

export function DataTable<T>({ columns, rows, rowKey, emptyMessage = "Tidak ada data.", onRowClick }: DataTableProps<T>) {
  if (rows.length === 0) {
    return <p className="px-5 py-12 text-center text-body-md text-on-surface-variant">{emptyMessage}</p>;
  }

  const visibleColumns = columns.filter((column) => !column.hideOnSmall);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-border-subtle bg-surface-container-low">
            {visibleColumns.map((column) => (
              <th key={column.key} scope="col" className={cn("px-5 py-3 text-label-sm font-label-sm uppercase tracking-wide text-on-surface-variant", column.className)}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border-subtle">
          {rows.map((row) => (
            <tr
              key={rowKey(row)}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={cn("transition-colors", onRowClick ? "cursor-pointer hover:bg-primary/5" : "")}
            >
              {visibleColumns.map((column) => (
                <td key={column.key} className={cn("px-5 py-4 align-middle", column.className)}>
                  {column.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}