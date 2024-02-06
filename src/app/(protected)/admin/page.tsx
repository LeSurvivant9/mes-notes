import Container from "@/components/ui/container";
import { Navbar } from "@/components/navbar";
import { ThemeProvider } from "@/theme/ThemeProvider";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { fetchAllData } from "@/data/get-all-datas";
import AdminComponent from "@/components/admin/admin";

export default async function AdminPage() {
  return (
    <ThemeProvider attribute={"class"} defaultTheme={"system"} enableSystem>
      <Navbar />
      <Container>
        <AdminComponent />
      </Container>
    </ThemeProvider>
  );
}
