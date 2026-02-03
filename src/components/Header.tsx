import { ShoppingBasket, Wallet } from "lucide-react";

interface HeaderProps {
  grandTotal: number;
}

const Header = ({ grandTotal }: HeaderProps) => {
  return (
    <header className="bg-card border-b border-border sticky top-0 z-10">
      <div className="container max-w-2xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2.5 rounded-xl">
              <ShoppingBasket className="h-7 w-7 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">বাজার খরচ</h1>
              <p className="text-sm text-muted-foreground">দৈনিক হিসাব রাখুন</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-accent px-4 py-2 rounded-xl">
            <Wallet className="h-5 w-5 text-accent-foreground" />
            <div className="text-right">
              <p className="text-xs text-muted-foreground">মোট খরচ</p>
              <p className="text-lg font-bold text-accent-foreground">৳{grandTotal}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
