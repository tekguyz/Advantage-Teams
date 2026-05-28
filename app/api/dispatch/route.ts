import { NextResponse } from 'next/server';
import { executeBatchOutboundDispatch } from '../../batch-dispatcher';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const report = await executeBatchOutboundDispatch();
    return NextResponse.json({
      status: "success",
      message: "Daily survey aggregation batch processed successfully.",
      report
    }, { status: 200 });
  } catch (error: any) {
    console.error("[REST DISPATCH API ERROR]:", error);
    return NextResponse.json({
      status: "error",
      message: "An internal server error occurred during batch dispatch execution.",
      details: error?.message || String(error)
    }, { status: 500 });
  }
}
