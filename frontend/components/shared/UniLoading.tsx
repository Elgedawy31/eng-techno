import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';

interface UniLoadingProps {
  message?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
}

const UniLoading = ({
  message = 'Loading...',
  className,
  size = 'md',
  fullScreen = false,
}: UniLoadingProps) => {
  const sizeClasses = {
    sm: 'size-4',
    md: 'size-6',
    lg: 'size-8',
  };

  const containerClasses = fullScreen
    ? 'flex min-h-screen items-center justify-center'
    : 'flex items-center justify-center py-12';

  return (
    <div className={cn(containerClasses, className)}>
      <div className="inline-flex flex-col items-center gap-3 text-muted-foreground">
        <Spinner className={cn(sizeClasses[size], 'text-primary')} />
        {message && (
          <p className={cn(
            'font-medium',
            size === 'sm' && 'text-sm',
            size === 'md' && 'text-base',
            size === 'lg' && 'text-lg'
          )}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default UniLoading;

