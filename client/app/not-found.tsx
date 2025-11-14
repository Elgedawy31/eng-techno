'use client'

import { FileQuestion, Home, ArrowLeft } from 'lucide-react'
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

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-muted">
            <FileQuestion className="size-8 text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl">404 - الصفحة غير موجودة</CardTitle>
          <CardDescription className="text-base">
            عذراً، الصفحة التي تبحث عنها غير موجودة
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-border bg-muted/50 p-4">
            <p className="text-sm font-medium text-muted-foreground">
              قد تكون الصفحة تم نقلها أو حذفها
            </p>
            <p className="mt-2 text-sm text-foreground">
              يرجى التحقق من الرابط أو العودة للصفحة الرئيسية
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3 sm:flex-row">
          <Button
            onClick={() => router.back()}
            className="w-full sm:w-auto"
            variant="default"
          >
            <ArrowLeft className="size-4" />
            العودة للخلف
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
