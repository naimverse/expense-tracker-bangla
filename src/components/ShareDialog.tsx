import { useState } from "react";
import { Users, Mail, Trash2, UserPlus, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWorkspace } from "@/contexts/WorkspaceContext";
import { useLang } from "@/contexts/LanguageContext";
import { toast } from "sonner";

const ShareDialog = () => {
  const { workspaces, activeOwnerUid, switchWorkspace, members, inviteMember, removeMember, isOwner } =
    useWorkspace();
  const { t, fmtNum } = useLang();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await inviteMember(email);
      toast.success(t("inviteSuccess", { email }));
      setEmail("");
    } catch (err) {
      const msg = err instanceof Error ? err.message : t("inviteFailed");
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemove = async (memberEmail: string) => {
    try {
      await removeMember(memberEmail);
      toast.success(t("memberRemoved"));
    } catch {
      toast.error(t("removeFailed"));
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-primary"
          title={t("share")}
        >
          <Users className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("shareTitle")}</DialogTitle>
          <DialogDescription>{t("shareDesc")}</DialogDescription>
        </DialogHeader>

        {workspaces.length > 1 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">{t("pickWorkspace")}</p>
            <div className="space-y-1.5">
              {workspaces.map((w) => {
                const active = w.ownerUid === activeOwnerUid;
                return (
                  <button
                    key={w.ownerUid}
                    onClick={() => switchWorkspace(w.ownerUid)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors text-left ${
                      active ? "border-primary bg-primary/5" : "border-border hover:bg-muted"
                    }`}
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-foreground truncate">{w.ownerName}</p>
                      <p className="text-xs text-muted-foreground truncate">{w.ownerEmail}</p>
                    </div>
                    {active && <Check className="h-4 w-4 text-primary shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {isOwner && (
          <>
            <form onSubmit={handleInvite} className="space-y-2">
              <p className="text-sm font-medium text-foreground">{t("addNewMember")}</p>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="user@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9 input-field"
                    required
                  />
                </div>
                <Button type="submit" disabled={submitting} className="add-button gap-1">
                  <UserPlus className="h-4 w-4" />
                  {t("add")}
                </Button>
              </div>
            </form>

            {members.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">
                  {t("members", { n: fmtNum(members.length) })}
                </p>
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {members.map((m) => (
                    <div
                      key={m.email}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-muted"
                    >
                      <span className="text-sm text-foreground truncate">{m.email}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => handleRemove(m.email)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {!isOwner && (
          <p className="text-sm text-muted-foreground text-center py-2">{t("youAreMember")}</p>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;
