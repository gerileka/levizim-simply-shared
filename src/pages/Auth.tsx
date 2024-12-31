import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          navigate("/");
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-stripe-bg">
      <div className="max-w-md w-full p-8 bg-stripe-muted rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-8 text-stripe-text">
          Welcome to LevizimBashke
        </h1>
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#9b87f5',
                  brandAccent: '#7c6bd6',
                  brandButtonText: "white",
                  defaultButtonBackground: "#403E43",
                  defaultButtonBackgroundHover: "#4a484d",
                  inputBackground: "#1A1F2C",
                  inputText: "#F1F1F1",
                  inputPlaceholder: "#666",
                  messageText: "#F1F1F1",
                  anchorTextColor: "#9b87f5",
                  dividerBackground: "#403E43",
                },
                space: {
                  inputPadding: "12px",
                  buttonPadding: "12px",
                },
                borderWidths: {
                  buttonBorderWidth: "0px",
                  inputBorderWidth: "1px",
                },
                radii: {
                  borderRadiusButton: "8px",
                  buttonBorderRadius: "8px",
                  inputBorderRadius: "8px",
                },
              },
            },
            style: {
              button: {
                border: "none",
                fontWeight: "500",
              },
              input: {
                backgroundColor: "#1A1F2C",
                color: "#F1F1F1",
                border: "1px solid #403E43",
              },
              label: {
                color: "#F1F1F1",
                marginBottom: "4px",
              },
            },
          }}
          localization={{
            variables: {
              sign_in: {
                email_label: "Email",
                password_label: "Password",
              },
              sign_up: {
                email_label: "Email",
                password_label: "Password",
              },
            },
          }}
          showLinks={true}
          providers={[]}
        />
      </div>
    </div>
  );
};

export default AuthPage;