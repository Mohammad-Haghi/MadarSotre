import { defineWidgetConfig } from "@medusajs/admin-sdk";
import type { AdminCustomer, DetailWidgetProps } from "@medusajs/framework/types";
import { Button, Container, Heading, Input, Label, Text } from "@medusajs/ui";
import { useEffect, useState } from "react";

const CustomerCredentials = ({ data }: DetailWidgetProps<AdminCustomer>) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const endpoint = `/admin/customers/${data.id}/credentials`;

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setPassword("");
    setMessage("");
    fetch(endpoint, { credentials: "include", signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("دریافت اطلاعات ورود انجام نشد.");
        const result = await response.json();
        setUsername(result.username);
        setLoading(false);
      })
      .catch((error) => {
        if (!controller.signal.aborted) { setMessage(error.message); setLoading(false); }
      });
    return () => controller.abort();
  }, [endpoint]);

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, ...(password ? { password } : {}) }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "ذخیره اطلاعات ورود انجام نشد.");
      setUsername(result.username);
      setPassword("");
      setMessage("اطلاعات ورود ذخیره شد.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "ذخیره اطلاعات ورود انجام نشد.");
    } finally { setSaving(false); }
  }

  return (
    <Container className="p-6" dir="rtl">
      <Heading level="h2">اطلاعات ورود مشتری</Heading>
      <Text className="mt-2">نام کاربری و گذرواژه را تعیین کنید و در اختیار مشتری قرار دهید. برای حفظ گذرواژه فعلی، کادر گذرواژه را خالی بگذارید.</Text>
      <form onSubmit={save} className="mt-4 flex max-w-md flex-col gap-3">
        <Label htmlFor="customer-username">نام کاربری</Label>
        <Input id="customer-username" value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="off" minLength={3} maxLength={64} required disabled={loading || saving} />
        <Label htmlFor="customer-password">گذرواژه جدید</Label>
        <Input id="customer-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" minLength={8} maxLength={256} disabled={loading || saving} />
        <Button type="submit" disabled={loading || saving}>ذخیره اطلاعات ورود</Button>
        {message && <Text role="status">{message}</Text>}
      </form>
    </Container>
  );
}

export default CustomerCredentials;

export const config = defineWidgetConfig({ zone: "customer.details.after" });
