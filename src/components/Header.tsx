import { Menu, MessageSquare, History, LogIn, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useToast } from "./ui/use-toast";

export const Header = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    // Получаем текущую сессию при загрузке
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserEmail(session?.user?.email ?? null);
    });

    // Подписываемся на изменения состояния аутентификации
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUserEmail(session?.user?.email ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось выйти из системы"
      });
    } else {
      toast({
        title: "Успешно",
        description: "Вы вышли из системы"
      });
      navigate("/auth");
    }
  };

  const handleLogin = () => {
    navigate("/auth");
  };

  return (
    <header className="h-12 border-b border-border bg-card flex items-center px-4 justify-between">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon">
          <Menu className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <MessageSquare className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <History className="h-4 w-4" />
        </Button>
      </div>
      
      <h1 className="text-sm font-medium">My Project</h1>
      
      <div className="flex items-center space-x-4">
        <span className="text-sm text-muted-foreground truncate max-w-[200px]">
          {userEmail || "Гость"}
        </span>
        {userEmail ? (
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
          </Button>
        ) : (
          <Button variant="ghost" size="icon" onClick={handleLogin}>
            <LogIn className="h-4 w-4" />
          </Button>
        )}
      </div>
    </header>
  );
};