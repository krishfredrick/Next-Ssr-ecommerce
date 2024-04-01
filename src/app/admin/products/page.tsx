import Link from "next/link";
import { PageHeader } from "../_components/PageHeader";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import db from "@/db/db";
import { profileEnd } from "console";
import { CheckCircle2, XCircle } from "lucide-react";

export default async function AdminProductPage() {
  return (
    <>
      <div className="flex justify-between items-center gap-4">
        <PageHeader> Products</PageHeader>
        <Button asChild>
          {/* asChild is neccessity to render this component as link rather button component */}
          <Link href="/admin/products/new">Add new Product</Link>
        </Button>
        <ProductsTable />

      </div>
    </>
  );
}

async function ProductsTable() {
  const products = await db.product.findMany({
    select: {
      id: true,
      name: true,
      priceInCents: true,
      isAvailableForPurchase: true,
      _count: { select: { order: true } },
    },
    orderBy: { name: "asc" },
  });
  // if (products.length === 0) return <p>No products found</p>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-0">
            <span className="sr-only">Availabe for Purchase</span>
          </TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Orders</TableHead>
          <TableHead className="w-0">
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>{products.map((product) => (
        <TableRow key={product.id}>
          <TableCell>
            {product.isAvailableForPurchase ? <>
            <CheckCircle2 />  
            <span className="sr-only">Available</span>
            </> : 
            <>
             <span className="sr-only">Un Available</span>
             < XCircle/>  
             </>
             }
          </TableCell>
        </TableRow>
      ))}</TableBody>
    </Table>
  );
}
