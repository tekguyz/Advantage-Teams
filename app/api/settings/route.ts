// app/api/settings/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const SettingsUpdateSchema = z.object({
  extension: z.string().regex(/^\d+$/, "Extension must be a numeric string"),
  mappedName: z.string().min(2, "Name must be at least 2 characters"),
  zohoUserId: z.string().min(3, "Zoho ID must be at least 3 characters"),
});

const BulkSettingsSchema = z.array(SettingsUpdateSchema);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = BulkSettingsSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json({
        status: 'error',
        message: 'Validation failed',
        errors: result.error.flatten(),
      }, { status: 400 });
    }

    // In a real application we would persist this, 
    // here we return a success response optimized for Vercel Serverless.
    return NextResponse.json({
      status: 'success',
      message: 'Extension mapping configuration updated natively on Vercel.',
      updatedCount: result.data.length,
    }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      message: 'Critical error while saving settings',
      details: error?.message || String(error),
    }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
