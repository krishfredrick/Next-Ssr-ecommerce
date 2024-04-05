import { Button } from "@/components/ui/button";
import Link from "next/link";


export default function page() {
  return (
    <>
      <h1 className="text-4xl mb-4">
        Download link Expired
      </h1>
      <Button asChild size="lg">
        <Link href="/orders">Get New Link</Link>
      </Button>
    </>
  )
}
