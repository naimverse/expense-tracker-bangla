import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AddItemFormProps {
  onAdd: (name: string, amount: number) => void;
}

const AddItemForm = ({ onAdd }: AddItemFormProps) => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && amount) {
      onAdd(name.trim(), parseFloat(amount));
      setName("");
      setAmount("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
      <Input
        type="text"
        placeholder="আইটেমের নাম"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="input-field flex-1"
      />
      <Input
        type="number"
        placeholder="টাকা"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="input-field w-24"
      />
      <Button type="submit" size="icon" className="add-button shrink-0">
        <Plus className="h-5 w-5" />
      </Button>
    </form>
  );
};

export default AddItemForm;
