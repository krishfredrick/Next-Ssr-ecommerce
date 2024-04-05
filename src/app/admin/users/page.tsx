import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { CheckCircle2, MoreVertical, XCircle } from "lucide-react";
import Link from "next/link";
import { ActiveToggleDropdownItem } from "../products/_components/productActions";
import { formatCurrency, formatNumber } from "@/lib/formatters";
import db from "@/db/db";
import { PageHeader } from "../_components/PageHeader";
import DeleteDropDownItem from "./_components/DeleteDropDownItem";

function getUsers(){
  return db.user.findMany({
    select:{
      id: true,
      email: true,
      orders: {
        select:{ pricePaidInCents: true}
      }
    }
  })
}

export default function usersPage(){
  return <>
  <PageHeader> Customers</PageHeader>
  <UserTable />
  </>
}

async function UserTable() {
  const users = await getUsers();
  if(users.length === 0 ) return <p> No Customer found</p>
  return (
    <Table>
      <TableHeader>
        <TableRow>
          
          <TableHead>Email</TableHead>
          <TableHead>Orders</TableHead>
          <TableHead>Value</TableHead>
          <TableHead className="w-0">
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.email}</TableCell>
            <TableCell>{formatNumber(user.orders.length)}</TableCell>
            <TableCell>{formatCurrency(user.orders.reduce((sum, o)=> o.pricePaidInCents + sum, 0)/100)}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <MoreVertical />
                  <span className="sr-only">Actions</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DeleteDropDownItem id = {user.id} />
                </DropdownMenuContent>
                
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
