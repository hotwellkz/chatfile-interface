import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface ModelSelectorProps {
  model: string;
  setModel: (model: string) => void;
}

export const ModelSelector = ({ model, setModel }: ModelSelectorProps) => {
  const models = [
    { id: 'gpt-4', name: 'GPT-4' },
    { id: 'gpt-4-mini', name: 'GPT-4 Mini' }
  ];

  return (
    <div className="flex items-center gap-2 mb-4">
      <Select value={model} onValueChange={setModel}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Выберите модель" />
        </SelectTrigger>
        <SelectContent>
          {models.map((m) => (
            <SelectItem key={m.id} value={m.id}>
              {m.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};