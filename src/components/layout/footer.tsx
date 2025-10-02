import Link from "next/link";
import { Leaf } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-secondary/40">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <Leaf className="h-6 w-6 text-primary" />
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by your friendly neighborhood AI.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">About</Link>
          <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Contact</Link>
          <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Terms of Service</Link>
          <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
}
