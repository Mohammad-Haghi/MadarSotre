import { defineRouteConfig } from "@medusajs/admin-sdk";
import { Button, Container, Heading, Input, Label, Text } from "@medusajs/ui";
import { useState } from "react";
import { Link } from "react-router-dom";

const CustomerAccountsPage = () => {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [customerId, setCustomerId] = useState("");

  async function createAccount(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    setSaving(true);
    setError("");
    setCustomerId("");
    try {
      const response = await fetch("/admin/customer-accounts", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(values)),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "ایجاد حساب انجام نشد.");
      form.reset();
      setCustomerId(result.customer.id);
    } catch (error) {
      setError(error instanceof Error ? error.message : "ایجاد حساب انجام نشد.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Container className="p-6" dir="rtl">
      <Heading level="h1">ایجاد حساب مشتری</Heading>
      <Text className="mt-2">حساب مشتری را با شماره موبایل، نام کاربری و گذرواژه ایجاد کنید. ایمیل لازم نیست.</Text>
      <form onSubmit={createAccount} className="mt-6 flex max-w-md flex-col gap-3">
        <Label htmlFor="account-first-name">نام</Label>
        <Input id="account-first-name" name="first_name" autoComplete="given-name" maxLength={100} disabled={saving} />
        <Label htmlFor="account-last-name">نام خانوادگی</Label>
        <Input id="account-last-name" name="last_name" autoComplete="family-name" maxLength={100} disabled={saving} />
        <Label htmlFor="account-phone">شماره موبایل</Label>
        <Input id="account-phone" name="phone" type="tel" autoComplete="tel" placeholder="09123456789" maxLength={30} required disabled={saving} dir="ltr" />
        <Label htmlFor="account-username">نام کاربری</Label>
        <Input id="account-username" name="username" autoComplete="off" minLength={3} maxLength={64} required disabled={saving} />
        <Label htmlFor="account-password">گذرواژه</Label>
        <Input id="account-password" name="password" type="password" autoComplete="new-password" minLength={8} maxLength={256} required disabled={saving} />
        <Text size="small">گذرواژه باید دست‌کم ۸ نویسه باشد. مشتری با نام کاربری و این گذرواژه وارد فروشگاه می‌شود.</Text>
        <Button type="submit" disabled={saving} isLoading={saving}>ایجاد حساب مشتری</Button>
        {error && <Text role="alert">{error}</Text>}
        {customerId && <div role="status"><Text>حساب مشتری ایجاد شد.</Text><Link className="text-ui-fg-interactive underline" to={`/customers/${customerId}`}>مشاهده مشتری و تغییر اطلاعات ورود</Link></div>}
      </form>
    </Container>
  );
};

export const config = defineRouteConfig({ label: "ایجاد حساب مشتری" });
export default CustomerAccountsPage;
