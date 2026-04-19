import { Link, useNavigate } from "react-router-dom";
import { ShoppingBasket, Wallet, BarChart3, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { Button } from "@/components/ui/button";
import ShareDialog from "./ShareDialog";
import { toast } from "sonner";

interface HeaderProps {
  grandTotal: number;
}

const Header = ({ grandTotal }: HeaderProps) => {
  const { user, signOut } = useAuth();
  const { workspaces, activeOwnerUid } = useWorkspace();
  const navigate = useNavigate();
  const activeWorkspace = workspaces.find((w) => w.ownerUid === activeOwnerUid);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("সাইন আউট হয়েছে");
      navigate("/");
    } catch {
      toast.error("সাইন আউট ব্যর্থ হয়েছে");
    }
  };

  const subtitle = activeWorkspace
    ? activeWorkspace.ownerName
    : user?.displayName || "দৈনিক হিসাব রাখুন";

  return (
    <header className="bg-card border-b border-border sticky top-0 z-10">
      <div className="container max-w-2xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="bg-primary/10 p-2.5 rounded-xl shrink-0">
              <ShoppingBasket className="h-7 w-7 text-primary" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl font-bold text-foreground truncate">বাজার খরচ</h1>
              <p className="text-sm text-muted-foreground truncate">{subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <ShareDialog />
            <Link
              to="/dashboard"
              className="p-2.5 rounded-xl bg-secondary/10 hover:bg-secondary/20 transition-colors"
              title="ড্যাশবোর্ড"
            >
              <BarChart3 className="h-5 w-5 text-secondary" />
            </Link>
            <div className="hidden sm:flex items-center gap-2 bg-accent px-3 py-2 rounded-xl">
              <Wallet className="h-5 w-5 text-accent-foreground" />
              <div className="text-right">
                <p className="text-xs text-muted-foreground">মোট খরচ</p>
                <p className="text-base font-bold text-accent-foreground">৳{grandTotal}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSignOut}
              className="text-muted-foreground hover:text-destructive"
              title="সাইন আউট"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <div className="sm:hidden flex items-center gap-2 bg-accent px-3 py-2 rounded-xl mt-3">
          <Wallet className="h-5 w-5 text-accent-foreground" />
          <p className="text-sm text-muted-foreground">মোট খরচ</p>
          <p className="text-base font-bold text-accent-foreground ml-auto">৳{grandTotal}</p>
        </div>
      </div>
    </header>
  );
};

export default Header;
