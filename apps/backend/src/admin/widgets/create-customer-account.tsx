import { defineWidgetConfig } from "@medusajs/admin-sdk";
import { Container, Heading, Text } from "@medusajs/ui";
import { Link } from "react-router-dom";

const CreateCustomerAccount = () => (
  <Container className="p-6" dir="rtl">
    <Heading level="h2">حساب مشتری با گذرواژه</Heading>
    <Text className="mt-2">برای ثبت مشتری با شماره موبایل، نام کاربری و گذرواژه از فرم ایجاد حساب استفاده کنید.</Text>
    <Link className="mt-3 inline-block text-ui-fg-interactive underline" to="/customer-accounts">ایجاد حساب مشتری</Link>
  </Container>
);

export const config = defineWidgetConfig({ zone: "customer.list.before" });
export default CreateCustomerAccount;
