import * as React from 'react';
import { cn } from '@/utils/cn';

/**
 * # CardUI
 * ---
 * - shadcn/ui 스타일 카드 레이아웃 복합 컴포넌트. `data-slot` 속성으로 각 영역 식별
 * - `Card`: 카드 루트 컨테이너 (`section`, `bg-card`, `rounded-xl`)
 * - `CardHeader`: 헤더 영역. `CardTitle`, `CardDescription`, `CardAction` 포함
 * - `CardTitle`: 카드 제목 (`font-semibold`)
 * - `CardDescription`: 부제목/설명 (`text-muted-foreground`)
 * - `CardAction`: 헤더 우측 액션 영역 (버튼 등)
 * - `CardContent`: 본문 콘텐츠 영역 (`px-6`)
 * - `CardFooter`: 푸터 영역 (`px-6`, flex row)
 * ---
 * @example
 * <Card>
 *   <CardHeader>
 *     <CardTitle>카드 제목</CardTitle>
 *     <CardDescription>카드 설명</CardDescription>
 *     <CardAction><Button>액션</Button></CardAction>
 *   </CardHeader>
 *   <CardContent>본문 내용</CardContent>
 *   <CardFooter>푸터</CardFooter>
 * </Card>
 */
function Card({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <section
      data-slot="card"
      className={cn('flex flex-col gap-6 rounded-xl bg-card py-6 text-card-foreground', className)}
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
