import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-6 space-y-4 bg-card rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center text-foreground">Добро пожаловать</h1>
        <SupabaseAuth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: 'rgb(var(--primary))',
                  brandAccent: 'rgb(var(--primary))',
                }
              }
            },
            style: {
              button: { background: 'rgb(var(--primary))', color: 'rgb(var(--primary-foreground))' },
              anchor: { color: 'rgb(var(--primary))' },
            }
          }}
          localization={{
            variables: {
              sign_in: {
                email_label: "Email адрес",
                password_label: "Пароль",
                email_input_placeholder: "Ваш email",
                password_input_placeholder: "Ваш пароль",
                button_label: "Войти",
                loading_button_label: "Вход...",
                social_provider_text: "Войти через {{provider}}",
                link_text: "Уже есть аккаунт? Войти",
              },
              sign_up: {
                email_label: "Email адрес",
                password_label: "Пароль",
                email_input_placeholder: "Ваш email",
                password_input_placeholder: "Ваш пароль",
                button_label: "Регистрация",
                loading_button_label: "Регистрация...",
                social_provider_text: "Зарегистрироваться через {{provider}}",
                link_text: "Нет аккаунта? Зарегистрироваться",
              },
              forgotten_password: {
                email_label: "Email адрес",
                password_label: "Пароль",
                email_input_placeholder: "Ваш email",
                button_label: "Отправить инструкции",
                loading_button_label: "Отправка инструкций...",
                link_text: "Забыли пароль?",
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default Auth;