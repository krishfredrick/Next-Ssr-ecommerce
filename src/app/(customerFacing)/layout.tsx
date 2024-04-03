import { Nav, NavLink } from "@/components/Nav/Nav";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Nav>
        <NavLink href="/">Home</NavLink> 
        <NavLink href="/products">Products</NavLink> 
        <NavLink href="/users">Customers</NavLink> 
      </Nav>
      <div className="container my-6">{children}</div>
    </>
  );
}