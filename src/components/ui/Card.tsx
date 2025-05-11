import { HTMLAttributes, forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={twMerge(
          'rounded-lg border border-gray-200 bg-white shadow-sm',
          hover && 'transition-shadow hover:shadow-md',
          className
        )}
        {...props}
      />
    );
  }
);

Card.displayName = 'Card';

const CardHeader = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={twMerge('px-6 py-4 border-b border-gray-200', className)}
      {...props}
    />
  );
});

CardHeader.displayName = 'CardHeader';

const CardTitle = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => {
  return (
    <h3
      ref={ref}
      className={twMerge('text-lg font-semibold leading-none tracking-tight', className)}
      {...props}
    />
  );
});

CardTitle.displayName = 'CardTitle';

const CardDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={twMerge('text-sm text-gray-600', className)}
      {...props}
    />
  );
});

CardDescription.displayName = 'CardDescription';

const CardContent = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={twMerge('px-6 py-4', className)}
      {...props}
    />
  );
});

CardContent.displayName = 'CardContent';

const CardFooter = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={twMerge('px-6 py-4 border-t border-gray-200', className)}
      {...props}
    />
  );
});

CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };