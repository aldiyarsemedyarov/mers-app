// Shopify data sync logic
import { prisma } from "../prisma";
import { shopifyAdminFetch } from "../shopify";
import type { StoreConfig } from "../stores";

type ShopifyOrder = {
  id: number;
  order_number: number;
  email: string | null;
  financial_status: string;
  fulfillment_status: string | null;
  total_price: string;
  subtotal_price: string;
  total_tax: string;
  total_discounts: string;
  currency: string;
  created_at: string;
  updated_at: string;
  cancelled_at: string | null;
  line_items: any[];
  shipping_address: any;
};

type ShopifyProduct = {
  id: number;
  title: string;
  handle: string;
  vendor: string | null;
  product_type: string | null;
  status: string;
  variants: any[];
  images: any[];
  created_at: string;
  updated_at: string;
  published_at: string | null;
};

export async function syncShopifyOrders(storeId: string, storeConfig?: StoreConfig) {
  const syncRun = await prisma.syncRun.create({
    data: {
      storeId,
      syncType: "orders",
      status: "running",
    },
  });

  try {
    let page = 1;
    let hasMore = true;
    let totalOrders = 0;

    while (hasMore && page <= 10) {
      // Limit to 10 pages for MVP
      const response = await shopifyAdminFetch<{ orders: ShopifyOrder[] }>(
        `/orders.json?status=any&limit=250&page=${page}`,
        undefined,
        storeConfig
      );

      const orders = response.orders;
      hasMore = orders.length === 250;

      for (const order of orders) {
        await prisma.order.upsert({
          where: { id: String(order.id) },
          create: {
            id: String(order.id),
            storeId,
            orderNumber: String(order.order_number),
            email: order.email,
            financialStatus: order.financial_status,
            fulfillmentStatus: order.fulfillment_status,
            totalPrice: order.total_price,
            subtotalPrice: order.subtotal_price,
            totalTax: order.total_tax,
            totalDiscounts: order.total_discounts,
            currency: order.currency,
            createdAt: new Date(order.created_at),
            updatedAt: new Date(order.updated_at),
            cancelledAt: order.cancelled_at ? new Date(order.cancelled_at) : null,
            lineItems: order.line_items,
            shippingAddress: order.shipping_address,
          },
          update: {
            financialStatus: order.financial_status,
            fulfillmentStatus: order.fulfillment_status,
            updatedAt: new Date(order.updated_at),
            cancelledAt: order.cancelled_at ? new Date(order.cancelled_at) : null,
          },
        });
        totalOrders++;
      }

      page++;
    }

    await prisma.syncRun.update({
      where: { id: syncRun.id },
      data: {
        status: "completed",
        recordCount: totalOrders,
        completedAt: new Date(),
      },
    });

    return { success: true, count: totalOrders };
  } catch (error: any) {
    await prisma.syncRun.update({
      where: { id: syncRun.id },
      data: {
        status: "failed",
        errorMsg: error.message || String(error),
        completedAt: new Date(),
      },
    });
    throw error;
  }
}

export async function syncShopifyProducts(storeId: string, storeConfig?: StoreConfig) {
  const syncRun = await prisma.syncRun.create({
    data: {
      storeId,
      syncType: "products",
      status: "running",
    },
  });

  try {
    let page = 1;
    let hasMore = true;
    let totalProducts = 0;

    while (hasMore && page <= 10) {
      // Limit to 10 pages for MVP
      const response = await shopifyAdminFetch<{ products: ShopifyProduct[] }>(
        `/products.json?limit=250&page=${page}`,
        undefined,
        storeConfig
      );

      const products = response.products;
      hasMore = products.length === 250;

      for (const product of products) {
        await prisma.product.upsert({
          where: { id: String(product.id) },
          create: {
            id: String(product.id),
            storeId,
            title: product.title,
            handle: product.handle,
            vendor: product.vendor,
            productType: product.product_type,
            status: product.status,
            variants: product.variants,
            images: product.images,
            createdAt: new Date(product.created_at),
            updatedAt: new Date(product.updated_at),
            publishedAt: product.published_at ? new Date(product.published_at) : null,
          },
          update: {
            title: product.title,
            status: product.status,
            updatedAt: new Date(product.updated_at),
            publishedAt: product.published_at ? new Date(product.published_at) : null,
          },
        });
        totalProducts++;
      }

      page++;
    }

    await prisma.syncRun.update({
      where: { id: syncRun.id },
      data: {
        status: "completed",
        recordCount: totalProducts,
        completedAt: new Date(),
      },
    });

    return { success: true, count: totalProducts };
  } catch (error: any) {
    await prisma.syncRun.update({
      where: { id: syncRun.id },
      data: {
        status: "failed",
        errorMsg: error.message || String(error),
        completedAt: new Date(),
      },
    });
    throw error;
  }
}

export async function syncShopifyStore(storeId: string, storeConfig?: StoreConfig) {
  // Run both syncs in parallel
  const [ordersResult, productsResult] = await Promise.all([
    syncShopifyOrders(storeId, storeConfig),
    syncShopifyProducts(storeId, storeConfig),
  ]);

  return {
    orders: ordersResult.count,
    products: productsResult.count,
  };
}
