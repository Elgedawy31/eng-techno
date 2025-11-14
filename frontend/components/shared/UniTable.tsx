'use client'
import { useReactTable, getCoreRowModel, flexRender, getPaginationRowModel, getSortedRowModel,type ColumnDef,type SortingState } from '@tanstack/react-table'
import { useState, useEffect } from 'react'

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Edit, Trash2, Eye, Plus } from 'lucide-react'
import { Button } from '../ui/button';
import NoDataMsg from './NoDataMsg';

export interface Action<TData> {
  label: string | ((rowData: TData) => string);
  onClick: (rowData: TData) => void;
}

interface UniTableProps<TData> {
  columns: ColumnDef<TData>[];
  data: TData[];
  actions?: Action<TData>[];
  tableName?: string;
  filterActions?: (rowData: TData, actions: Action<TData>[]) => Action<TData>[];
  onRowSelect?: (selectedRows: TData[]) => void;
  totalItems: number;
  itemsPerPage: number;
  onPageChange?: (page: number) => void;
  headerActions?: Action<TData>[];
  isLoading?: boolean;
  currentPage?: number;
  onPerPageChange?: (perPage: number) => void;
  onRowClick?: (rowData: TData) => void;
}


const UniTable = <TData extends object>({
  columns,
  data,
  actions,
  filterActions,
  onRowSelect,
  totalItems,
  itemsPerPage,
  onPageChange,
  headerActions,
  currentPage,
  tableName,
  onRowClick
}: UniTableProps<TData>) => {
  console.log("UniTable Props:", { columns, data, actions, filterActions, onRowSelect, totalItems, itemsPerPage, onPageChange, headerActions, currentPage, tableName, onRowClick });
  const [rowSelection, setRowSelection] = useState({})
  const [sorting, setSorting] = useState<SortingState>([])

  const getResolvedLabel = (action: Action<TData>, rowData: TData) =>
    typeof action.label === 'function' ? action.label(rowData) : action.label;

  const columnsWithSorting = columns.map(column => ({
    ...column,
    enableSorting: column.enableSorting !== false // Default to true unless explicitly set to false
  }));


  const columnsWithActions = [
    ...(headerActions && headerActions.length > 0 ? [{
      id: 'header-actions',
      header: 'Actions',
      cell: () => (
        <div className="relative flex items-center justify-end gap-2 pr-2">
          {headerActions?.map((action, index) => {
            const actionLabel = getResolvedLabel(action, {} as TData);
            let IconComponent: React.ElementType | null = null;

            switch (actionLabel) {
              case 'Add':
                IconComponent = Plus;
                break;
              // Add more cases for other header actions if needed
              default:
                break;
            }

            return (
              <Button
                key={index}
                variant="ghost"
                className="h-8 w-8 p-0"
                onClick={(event) => {
                  event.stopPropagation();
                  action.onClick({} as TData);
                }}
                title={actionLabel}
              >
                {IconComponent && <IconComponent className={`h-4 w-4 ${actionLabel === 'Delete' ? 'text-red-500' : 'text-foreground'}`} />}
                <span className="sr-only">{actionLabel}</span>
              </Button>
            );
          })}
        </div>
      ),
      size: 80,
    }] : []),
    // User provided columns with sorting enabled by default
    ...columnsWithSorting,
    // Actions column (only if actions exist and not empty)
    ...(actions && actions.length > 0  ? [{
      id: 'actions',
      header: 'Actions',
      cell: ({ row }: { row: { original: TData } }) => {
        // Apply filterActions if provided, otherwise use original actions
        const filteredActions = filterActions
          ? filterActions(row.original, actions)
          : actions;

        // If no actions remain after filtering, return null to hide the column
        if (!filteredActions || filteredActions.length === 0) {
          return null;
        }

        return (
          <div className="relative flex items-center justify-end gap-2 pr-2">
            {filteredActions?.map((action, index) => {
              const actionLabel = getResolvedLabel(action, row.original);
              let IconComponent: React.ElementType | null = null;

              switch (actionLabel) {
                case 'Edit':
                  IconComponent = Edit;
                  break;
                case 'Delete':
                  IconComponent = Trash2;
                  break;
                case 'Details':
                  IconComponent = Eye;
                  break;
                default:
                  break;
              }

              return (
                <Button
                  key={index}
                  variant="ghost"
                  className="h-8 w-8 p-0"
                  onClick={(event) => {
                    event.stopPropagation();
                    action.onClick(row.original);
                  }}
                  title={actionLabel}
                >
                  {IconComponent && <IconComponent className={`h-4 w-4 ${actionLabel === 'Delete' ? 'text-red-500' : 'text-'}`} />}
                  <span className="sr-only">{actionLabel}</span>
                </Button>
              );
            })}
          </div>
        );
      },
      size: 80,
    }] : []),
  ]

  const table = useReactTable({
    data,
    pageCount: Math.ceil(totalItems / itemsPerPage),
    state: {
      rowSelection,
      sorting,
      pagination: { pageIndex: (currentPage && currentPage > 0) ? currentPage - 1 : 0, pageSize: itemsPerPage },
    },
    columns: columnsWithActions,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true, // Tell TanStack Table that we'll handle pagination ourselves
  })


  // Notify parent of selection changes
  useEffect(() => {
    if (onRowSelect) {
      const selectedRows = table.getSelectedRowModel().rows
      onRowSelect(selectedRows.map(row => row.original))
    }
  }, [rowSelection, onRowSelect, table])

  const hasNoData = !data || data.length === 0

  return (
    <div className="overflow-visible border-color">
      {hasNoData ? (
        <NoDataMsg
          title="No data"
          description="No data to display in this table"
          additionalMessage="Try changing the filters or check again later"
        />
      ) : (
        <div className="rounded-lg  overflow-x-auto max-w-full  shadow-sm">
          <table className="divide-y divide-border w-full ">
        <thead className="">
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th
                  key={header.id}
                  className={`p-4 text-xs font-normal text-grey-400 uppercase tracking-wider ${header.id === 'actions' || header.id === 'header-actions' ? '' : 'text-left'}`}
                  style={{ width: header.getSize() }}
                >
                  {header.column.getCanSort() ? (
                    <div
                      className="flex items-center cursor-pointer select-none group"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      <span className="ml-2 relative w-4 flex-none">
                        {{
                          asc: (
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                          ),
                          desc: (
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          ),
                        }[header.column.getIsSorted() as string] ?? (
                          <svg className="w-4 h-4 opacity-0 group-hover:opacity-50 transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                          </svg>
                        )}
                      </span>
                    </div>
                  ) : (
                    flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className=" divide-y divide-border">
          {table.getRowModel().rows.map(row => (
            <tr key={row.id} className={`hover:bg-muted/50 data-[state=selected]:bg-muted/50 transition-all duration-150 ease-in-out ${onRowClick ? 'cursor-pointer' : ''}`}
                onClick={() => onRowClick && onRowClick(row.original)} // Add onClick handler
            >
              {row.getVisibleCells().map(cell => (
                <td
                  key={cell.id}
                  className="px-6 py-3 whitespace-nowrap text-sm text-foreground font-light"
                >
                  {/* Check if the column is an action column */}
                  {cell.column.id === 'actions' || cell.column.id === 'header-actions' ? (
                    flexRender(cell.column.columnDef.cell, cell.getContext())
                  ) : (
                    cell.getValue() ? (
                      <div 
                        className="max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap"
                        title={String(cell.getValue())}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="py-3 px-3 flex items-center justify-between text-sm text-muted-foreground font-medium flex-wrap gap-y-2">
        <span className="flex items-center gap-1">
          {data.length} of{" "}
          {totalItems} {tableName ? tableName : "item"}.
        </span>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center justify-center text-sm font-medium">
            Page {currentPage || 1} of {Math.ceil(totalItems / itemsPerPage) || 1}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => {
                onPageChange?.(1)
              }}
              disabled={currentPage === 1 || !table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to the first page</span>
              <ChevronsRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => {
                onPageChange?.((currentPage || 1) - 1)
              }}
              disabled={currentPage === 1 || !table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to the previous page</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => {
                onPageChange?.((currentPage || 1) + 1)
              }}
              disabled={currentPage === Math.ceil(totalItems / itemsPerPage) || !table.getCanNextPage()}
            >
              <span className="sr-only">Go to the next page</span>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => {
                onPageChange?.(Math.ceil(totalItems / itemsPerPage) || 1)
              }}
              disabled={currentPage === Math.ceil(totalItems / itemsPerPage) || !table.getCanNextPage()}
            >
              <span className="sr-only">Go to the last page</span>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
        </div>
      )}
    </div>
  )
}

export default UniTable