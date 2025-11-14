'use client';

import React, { useRef, useState, useCallback, useImperativeHandle } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from 'cmdk';
import { Loader, Check, ChevronRight, Info, ChevronDown, ChevronLeft } from 'lucide-react';
import { usePaginatedSearch } from './usePaginatedSearch';
import { type OptionType } from '@/types/api.types';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface UiAutocompleteProps {
  endpoint: string; // <-- بدل resource
  onChange: (value: OptionType | null) => void;
  value: OptionType | null;
  placeholder?: string;
  pageSize?: number;
  nameKey?: string;
  idKey?: string;
  className?: string;
  disabled?: boolean;
  emptyMessage?: string;
  triggerOnFocus?: boolean;
  additionalParams?: Record<string, string | number | undefined>;
  onInputChange?: (value: string) => void;
}

export const UiAutocomplete = React.forwardRef<HTMLInputElement | null, UiAutocompleteProps>(
  (
    { 
      endpoint,
      onChange,
      value,
      placeholder = "Select an option",
      pageSize,
      nameKey,
      idKey,
      className,
      disabled,
      emptyMessage = "لا يوجد نتائج",
      triggerOnFocus = false,
      additionalParams = {},
      onInputChange,
    },
    ref
  ) => {
    const [open, setOpen] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const {
      options,
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
      isLoading,
      handleSearchChange,
      searchTerm,
    } = usePaginatedSearch({
      endpoint,
      pageSize,
      nameKey,
      idKey,
      enabled: !triggerOnFocus || open,
      additionalParams,
    });

    useImperativeHandle(ref, () => inputRef.current!);

    const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
      const target = e.target as HTMLDivElement;
      if (target.scrollHeight - target.scrollTop <= target.clientHeight + 50 && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

    const handleOpenChange = useCallback((newOpen: boolean) => {
      if (!newOpen) {
        handleSearchChange(''); // Always clear search term when closing
        if (onInputChange) {
          onInputChange(value?.name || ''); // Pass the actual selected value's name
        }
      }
      setOpen(newOpen);
    }, [value, handleSearchChange, onInputChange]);

    return (
      <div className="">
        <Popover open={disabled ? false : open} onOpenChange={disabled ? undefined : handleOpenChange}>
          <PopoverTrigger asChild disabled={disabled}>
            <div className="relative w-full">
              <Input
                ref={inputRef}
                value={value?.name ?? ''}
                placeholder={placeholder}
                className={cn("w-full", className, disabled && "cursor-not-allowed opacity-50")}
                disabled={disabled}
                readOnly
                role="combobox"
                aria-autocomplete="list"
                aria-expanded={open}
                aria-controls="autocomplete-list"
              />
              {!disabled && (
                isLoading ? (
                  <Loader className="h-4 w-4 animate-spin absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                ) : (
                  options.length > 0 ? (
                    <ChevronDown className={cn("h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-transform", open && "rotate-180")} />
                  ) : (
                    <ChevronLeft className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  )
                )
              )}
            </div>
          </PopoverTrigger>
          {!disabled && (
            <PopoverContent 
              className={cn(
                "p-0 max-h-[300px] overflow-hidden",
                "data-[state=open]:animate-in data-[state=closed]:animate-out",
                "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
                "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
                "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
                "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
              )}
              align="start" 
              sideOffset={4}
              id="autocomplete-list"
              style={{ width: 'var(--radix-popover-trigger-width)' }}
            >
              <Command shouldFilter={false} className="w-full">
                <CommandInput
                  value={searchTerm}
                  onValueChange={handleSearchChange}
                  placeholder={placeholder}
                  className="h-9 hidden"
                />
                {!(isLoading && searchTerm === '') && (
                  <CommandList onScroll={handleScroll} className="max-h-[300px] overflow-y-auto p-1">
                    {options.length === 0 && !isLoading ? (
                      <div className="flex items-center justify-center gap-2 p-4 text-sm text-muted-foreground">
                        <Info className="h-4 w-4" />
                        <CommandEmpty>{emptyMessage}</CommandEmpty>
                      </div>
                    ) : (
                      <CommandGroup>
                        {options.map((option) => (
                          <CommandItem
                            key={option.id}
                            value={String(option.id)}
                            onSelect={() => {
                              onChange(option);
                              setOpen(false);
                            }}
                            className="relative flex w-full cursor-default select-none items-center justify-between gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground hover:bg-accent hover:text-accent-foreground"
                          >
                            {option.name}
                            {value?.id === option.id && (
                              <span className="absolute right-2 flex size-3.5 items-center justify-center">
                                <Check className="size-4" />
                              </span>
                            )}
                          </CommandItem>
                        ))}
                        {hasNextPage && (isFetchingNextPage ? (
                          <CommandItem className="flex items-center justify-center p-2">
                            <Loader className="h-4 w-4 animate-spin" />
                          </CommandItem>
                        ) : (
                          <CommandItem
                            onSelect={() => fetchNextPage()}
                            className="flex cursor-pointer items-center justify-center gap-2 rounded-sm py-1.5 text-sm text-primary hover:bg-accent hover:text-accent-foreground"
                          >
                            Load More
                            <ChevronRight className="h-4 w-4" />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    )}
                  </CommandList>
                )}
              </Command>
            </PopoverContent>
          )}
        </Popover>
      </div>
    );
  }
);

UiAutocomplete.displayName = "UiAutocomplete";
