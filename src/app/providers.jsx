import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../features/auth/hooks/useAuth";
import { ConfigProvider } from "antd";

const queryClient = new QueryClient();

function Providers({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#1890ff",
            colorSuccess: "#52c41a",
            borderRadius: 6,
            fontFamily: "'Inter', 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          },
        }}
      >
        <AuthProvider>
          <BrowserRouter>{children}</BrowserRouter>
        </AuthProvider>
      </ConfigProvider>
    </QueryClientProvider>
  );
}

export default Providers;