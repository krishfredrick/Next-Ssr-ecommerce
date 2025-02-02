import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import db from "@/db/db";
import { formatCurrency, formatNumber } from "@/lib/formatters";

async function getSalesData() {
  const data = await db.order.aggregate({
    _sum: { pricePaidInCents: true },
    _count: true,
  });
  return {
    amount: (data._sum.pricePaidInCents || 0) / 100,
    numberOfSales: data._count,
  };
}

async function getUserData() {
  const [userCount, orderData] = await Promise.all([
    db.user.count(),
    db.order.aggregate({
      _sum: { pricePaidInCents: true },
    }),
  ]);
  return {
    userCount,
    averageValuePerUser:
      userCount === 0
        ? 0
        : (orderData._sum.pricePaidInCents || 0) / userCount / 100,
  };
}

async function getProductData() {
  const [activeCount, inActiveCount] = await Promise.all([
    db.product.count({ where: { isAvailableForPurchase: true } }),
    db.product.count({ where: { isAvailableForPurchase: true } }),
  ]);
  return { activeCount, inActiveCount };
}

export default async function AdminDashBoard() {
  const [salesData, userData, productData] = await Promise.all([
    getSalesData(),
    getUserData(),
    getProductData(),
  ]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <DashboardCard
        title="sales"
        subtitle={`${formatNumber(salesData.numberOfSales)} orders`}
        body={formatCurrency(salesData.amount)}
      />
      <DashboardCard
        title="Customer"
        subtitle={`${formatNumber(userData.averageValuePerUser)} Average Value`}
        body={formatCurrency(userData.userCount)}
      />
      <DashboardCard
        title="Active Product"
        subtitle={`${formatNumber(productData.inActiveCount)} Inactive product`}
        body={formatCurrency(productData.activeCount)}
      />
    </div>
  );
}

type DashboardCardProps = {
  title: string;
  subtitle: string;
  body: string;
};

function DashboardCard({
  title,
  subtitle,
  body,
}: Readonly<DashboardCardProps>) {
  return (
    <Card>
      <CardHeader>{title}</CardHeader>
      <CardDescription>{subtitle}</CardDescription>
      <CardContent>
        <p> {body}</p>
      </CardContent>
    </Card>
  );
}
