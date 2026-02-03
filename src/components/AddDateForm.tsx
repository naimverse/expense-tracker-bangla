import { useState } from "react";
import { CalendarPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AddDateFormProps {
  onAdd: (date: string) => void;
}

const AddDateForm = ({ onAdd }: AddDateFormProps) => {
  const [date, setDate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (date.trim()) {
      onAdd(date.trim());
      setDate("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 mb-6">
      <Input
        type="text"
        placeholder="তারিখ লিখুন (যেমন: ১.২.২৬)"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="input-field flex-1 text-lg"
      />
      <Button type="submit" className="add-button gap-2 px-5">
        <CalendarPlus className="h-5 w-5" />
        <span className="hidden sm:inline">তারিখ যোগ করুন</span>
      </Button>
    </form>
  );
};

export default AddDateForm;
