import { AbstractAuthModuleProvider, ModuleProvider, Modules } from "@medusajs/framework/utils";
import type { AuthenticationInput, AuthenticationResponse, AuthIdentityProviderService } from "@medusajs/framework/types";
import { normalizeUsername, verifyPassword } from "../../auth/credentials";

class UsernameAuthProvider extends AbstractAuthModuleProvider {
  static identifier = "usernamepass";
  static DISPLAY_NAME = "Username and password";

  async authenticate(input: AuthenticationInput, service: AuthIdentityProviderService): Promise<AuthenticationResponse> {
    const { username, password } = input.body ?? {};
    const failure = { success: false, error: "Invalid username or password" };
    if (typeof username !== "string" || typeof password !== "string" || password.length > 256) return failure;
    try {
      const identity = await service.retrieve({ entity_id: normalizeUsername(username) });
      const provider = identity.provider_identities?.find((entry) => entry.provider === "usernamepass");
      const hash = provider?.provider_metadata?.password_hash;
      if (typeof hash !== "string" || !identity.app_metadata?.customer_id || !await verifyPassword(password, hash)) return failure;
      return { success: true, authIdentity: { ...identity, provider_identities: identity.provider_identities?.map((entry) => ({ ...entry, provider_metadata: {} })) } };
    } catch {
      return failure;
    }
  }

  async register(): Promise<AuthenticationResponse> {
    return { success: false, error: "Contact the store administrator to create your account" };
  }
}

export default ModuleProvider(Modules.AUTH, { services: [UsernameAuthProvider] });
