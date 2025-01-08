import { Button } from "../ui/button";

const EXAMPLE_PROMPTS = [
  "Создай простое веб-приложение",
  "Помоги мне с React компонентом",
  "Как использовать TypeScript?"
];

export const ExamplePrompts = (
  handlePrompt: (event: React.MouseEvent, prompt: string) => void
) => {
  return (
    <div className="max-w-chat mx-auto mb-6">
      <h3 className="text-sm font-medium mb-2 text-center">Примеры запросов</h3>
      <div className="flex flex-wrap gap-2 justify-center">
        {EXAMPLE_PROMPTS.map((prompt) => (
          <Button
            key={prompt}
            variant="outline"
            size="sm"
            onClick={(e) => handlePrompt(e, prompt)}
          >
            {prompt}
          </Button>
        ))}
      </div>
    </div>
  );
};