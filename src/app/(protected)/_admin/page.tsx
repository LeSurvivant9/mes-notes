import Container from "@/components/ui/container";
import { Navbar } from "@/components/navbar";
import { ThemeProvider } from "@/theme/ThemeProvider";
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
