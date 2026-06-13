import * as React from 'react';
import { cn } from '../utils/cn';

/**
 * # Card
 * ---
 * - 간단설명: 여행지·숙소 정보를 담는 카드 컨테이너
 * - 제약사항: 이미지는 상단 정렬, top-radius bleed 없음
 * ---
 * @example
 * <Card>
 *   <CardHeader><CardTitle>제주 신라호텔</CardTitle></CardHeader>
 *   <CardContent>해변 뷰 객실</CardContent>
 *   <CardFooter>₩250,000 / 박</CardFooter>
 * </Card>
 */
function Card({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <section
      data-slot="card"
      className={cn('bg-white rounded-2xl shadow-[0px_4px_12px_rgba(0,0,0,0.05)] p-4', className)}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        'has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6 flex auto-rows-min grid-rows-[auto_auto] items-center justify-between gap-1.5 px-6',
        className
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-title"
      className={cn('font-semibold leading-none', className)}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-description"
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-action"
      className={cn('col-start-2 row-span-2 row-start-1 self-start justify-self-end', className)}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return <div data-slot="card-content" className={cn('px-6', className)} {...props} />;
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-footer"
      className={cn('[.border-t]:pt-6 flex items-center px-6', className)}
      {...props}
    />
  );
}

export { Card, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardContent };
