import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TableProps extends React.HTMLAttributes<HTMLTableElement> {}
export interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {}
export interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {}
export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {}
export interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {}
export interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {}

export const Table = React.forwardRef<HTMLTableElement, TableProps>(({ className, ...props }, ref) => (
  <table ref={ref} className={cn('w-full caption-bottom text-sm', className)} {...props} />
));
Table.displayName = 'Table';

export const TableHeader = React.forwardRef<HTMLTableSectionElement, TableHeaderProps>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn('[&_tr]:border-b', className)} {...props} />
));
TableHeader.displayName = 'TableHeader';

export const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(({ className, ...props }, ref) => (
  <tbody ref={ref} className={cn('[&_tr:last-child]:border-0', className)} {...props} />
));
TableBody.displayName = 'TableBody';

export const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(({ className, ...props }, ref) => (
  <tr ref={ref} className={cn('border-b border-white/10 transition-colors hover:bg-white/5', className)} {...props} />
));
TableRow.displayName = 'TableRow';

export const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(({ className, ...props }, ref) => (
  <th ref={ref} className={cn('h-12 px-4 text-left align-middle font-medium text-white/80 [&:has([role=checkbox])]:pr-0', className)} {...props} />
));
TableHead.displayName = 'TableHead';

export const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(({ className, ...props }, ref) => (
  <td ref={ref} className={cn('p-4 align-middle text-white/90 [&:has([role=checkbox])]:pr-0', className)} {...props} />
));
TableCell.displayName = 'TableCell';
