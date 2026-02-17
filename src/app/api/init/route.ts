import { NextRequest, NextResponse } from "next/server";
import { getOrCreateDevUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { shopifyAdminFetch, type ShopifyShopResponse } from "@/lib/shopify";
import { metaFetch, type MetaAccountResponse, getMetaAdAccountId } from "@/lib/meta";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const user = await getOrCreateDevUser();

    // Check if store already exists
    let store = user.stores[0];

    if (store) {
      return NextResponse.json({
        ok: true,
        data: { message: "Store already initialized", store },
      });
    }

    // Fetch Shopify shop info
    const shopifyDomain = process.env.SHOPIFY_SHOP_DOMAIN || "";
    const shopifyToken = process.env.SHOPIFY_ADMIN_TOKEN || "";
    const metaAdAccountId = getMetaAdAccountId();
    const metaAccessToken = process.env.META_ACCESS_TOKEN || "";

    if (!shopifyDomain || !shopifyToken) {
      return NextResponse.json(
        { ok: false, error: "Shopify credentials not configured" },
        { status: 400 }
      );
    }

    const shopData = await shopifyAdminFetch<ShopifyShopResponse>("/shop.json");
    const shop = shopData.shop;

    // Create store
    store = await prisma.store.create({
      data: {
        userId: user.id,
        name: shop.name,
        slug: shop.myshopify_domain.split(".")[0],
        shopifyDomain: shop.myshopify_domain,
        shopifyToken: shopifyToken,
        currency: shop.currency,
        timezone: shop.timezone,
        integrations: {
          create: [
            {
              provider: "shopify",
              status: "active",
              accessToken: shopifyToken,
              lastSyncAt: new Date(),
            },
          ],
        },
      },
      include: {
        integrations: true,
      },
    });

    // Try to add Meta integration if configured
    if (metaAdAccountId && metaAccessToken) {
      try {
        const metaAccount = await metaFetch<MetaAccountResponse>(`/${metaAdAccountId}`);

        await prisma.integration.create({
          data: {
            storeId: store.id,
            provider: "meta",
            status: "active",
            accessToken: metaAccessToken,
            metadata: {
              accountId: metaAccount.id,
              accountName: metaAccount.name,
            },
          },
        });

        await prisma.adAccount.create({
          data: {
            id: metaAccount.id,
            storeId: store.id,
            provider: "meta",
            name: metaAccount.name,
            currency: metaAccount.currency || "USD",
          },
        });
      } catch (metaError) {
        console.error("Failed to add Meta integration:", metaError);
        // Continue without Meta - not critical for initialization
      }
    }

    return NextResponse.json({
      ok: true,
      data: {
        message: "Store initialized successfully",
        store,
      },
    });
  } catch (e: any) {
    return NextResponse.json(
      {
        ok: false,
        error: e?.message || String(e),
      },
      { status: 500 }
    );
  }
}
