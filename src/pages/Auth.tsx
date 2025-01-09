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
    <div className="min-h-screen flex items-center justify-center bg-[#1A1F2C] p-4">
      <div className="w-full max-w-md space-y-6 bg-[#221F26] p-8 rounded-lg shadow-xl border border-border/20">
        <h1 className="text-3xl font-bold text-center text-white mb-8">Добро пожаловать</h1>
        <SupabaseAuth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#9b87f5',
                  brandAccent: '#7E69AB',
                  brandButtonText: 'white',
                  defaultButtonBackground: '#403E43',
                  defaultButtonBackgroundHover: '#4a4950',
                  inputBackground: '#2A2A2A',
                  inputBorder: '#403E43',
                  inputBorderHover: '#4a4950',
                  inputBorderFocus: '#9b87f5',
                }
              }
            },
            style: {
              button: { 
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                padding: '12px',
                fontWeight: '500',
              },
              anchor: { 
                color: '#9b87f5',
                fontSize: '14px',
              },
              input: {
                backgroundColor: '#2A2A2A',
                color: 'white',
                fontSize: '16px',
                padding: '12px',
                borderRadius: '8px',
              },
              label: {
                color: '#E0E0E0',
                fontSize: '14px',
                marginBottom: '8px',
              },
              message: {
                color: '#E0E0E0',
                fontSize: '14px',
              },
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