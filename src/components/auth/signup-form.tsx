import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PersonalSignupForm } from "./personal-signup-form";
import { BusinessSignupForm } from "./business-signup-form";

export function SignupForm() {
  return (
    <Tabs defaultValue="personal" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="personal">Personal</TabsTrigger>
        <TabsTrigger value="business">Empresa</TabsTrigger>
      </TabsList>
      <TabsContent value="personal" className="pt-4">
        <PersonalSignupForm />
      </TabsContent>
      <TabsContent value="business" className="pt-4">
        <BusinessSignupForm />
      </TabsContent>
    </Tabs>
  );
}
