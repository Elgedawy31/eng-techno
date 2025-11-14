'use client'

import { useEffect } from 'react'
import { AlertCircle, Home, RefreshCw } from 'lucide-react'
import { useRouter } from 'next/navigation'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  const router = useRouter()

  useEffect(() => {
    // Log error to console for debugging
    console.error('Error boundary caught an error:', error)
  }, [error])

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="size-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl">حدث خطأ</CardTitle>
          <CardDescription className="text-base">
            عذراً، حدث خطأ غير متوقع
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error.message && (
            <div className="rounded-lg border border-border bg-muted/50 p-4">
              <p className="text-sm font-medium text-muted-foreground">
                تفاصيل الخطأ:
              </p>
              <p className="mt-2 text-sm text-foreground">{error.message}</p>
            </div>
          )}
          {error.digest && (
            <p className="text-xs text-muted-foreground">
              رمز الخطأ: {error.digest}
            </p>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-3 sm:flex-row">
          <Button
            onClick={reset}
            className="w-full sm:w-auto"
            variant="default"
          >
            <RefreshCw className="size-4" />
            إعادة المحاولة
          </Button>
          <Button
            onClick={() => router.push('/')}
            className="w-full sm:w-auto"
            variant="outline"
          >
            <Home className="size-4" />
            العودة للرئيسية
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
