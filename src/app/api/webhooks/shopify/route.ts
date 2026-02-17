import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export const runtime = "nodejs";

// Verify Shopify webhook signature
function verifyShopifyWebhook(body: string, hmacHeader: string | null): boolean {
  if (!hmacHeader) return false;

  const secret = process.env.SHOPIFY_WEBHOOK_SECRET;
  if (!secret) return false; // Skip verification if no secret configured (dev mode)

  const hash = crypto.createHmac("sha256", secret).update(body, "utf8").digest("base64");
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(hmacHeader));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const hmacHeader = request.headers.get("x-shopify-hmac-sha256");
    const topic = request.headers.get("x-shopify-topic");
    const shopDomain = request.headers.get("x-shopify-shop-domain");

    // Verify signature (skip in dev if no secret)
    if (process.env.SHOPIFY_WEBHOOK_SECRET) {
      if (!verifyShopifyWebhook(body, hmacHeader)) {
        return NextResponse.json({ ok: false, error: "Invalid signature" }, { status: 401 });
      }
    }

    if (!topic || !shopDomain) {
      return NextResponse.json({ ok: false, error: "Missing headers" }, { status: 400 });
    }

    const data = JSON.parse(body);

    // Find store by Shopify domain
    const store = await prisma.store.findFirst({
      where: { shopifyDomain: shopDomain },
    });

    if (!store) {
      return NextResponse.json({ ok: false, error: "Store not found" }, { status: 404 });
    }

    // Handle different webhook topics
    if (topic === "orders/create" || topic === "orders/updated" || topic === "orders/paid") {
      await prisma.order.upsert({
        where: { id: String(data.id) },
        create: {
          id: String(data.id),
          storeId: store.id,
          orderNumber: String(data.order_number),
          email: data.email,
          financialStatus: data.financial_status,
          fulfillmentStatus: data.fulfillment_status,
          totalPrice: data.total_price,
          subtotalPrice: data.subtotal_price,
          totalTax: data.total_tax,
          totalDiscounts: data.total_discounts,
          currency: data.currency,
          createdAt: new Date(data.created_at),
          updatedAt: new Date(data.updated_at),
          cancelledAt: data.cancelled_at ? new Date(data.cancelled_at) : null,
          lineItems: data.line_items,
          shippingAddress: data.shipping_address,
        },
        update: {
          financialStatus: data.financial_status,
          fulfillmentStatus: data.fulfillment_status,
          updatedAt: new Date(data.updated_at),
          cancelledAt: data.cancelled_at ? new Date(data.cancelled_at) : null,
          lineItems: data.line_items,
        },
      });
    } else if (topic === "products/create" || topic === "products/update") {
      await prisma.product.upsert({
        where: { id: String(data.id) },
        create: {
          id: String(data.id),
          storeId: store.id,
          title: data.title,
          handle: data.handle,
          vendor: data.vendor,
          productType: data.product_type,
          status: data.status,
          variants: data.variants,
          images: data.images,
          createdAt: new Date(data.created_at),
          updatedAt: new Date(data.updated_at),
          publishedAt: data.published_at ? new Date(data.published_at) : null,
        },
        update: {
          title: data.title,
          status: data.status,
          updatedAt: new Date(data.updated_at),
          publishedAt: data.published_at ? new Date(data.published_at) : null,
          variants: data.variants,
          images: data.images,
        },
      });
    } else if (topic === "products/delete") {
      await prisma.product.update({
        where: { id: String(data.id) },
        data: { status: "archived" },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("Webhook error:", e);
    return NextResponse.json(
      {
        ok: false,
        error: e?.message || String(e),
      },
      { status: 500 }
    );
  }
}
