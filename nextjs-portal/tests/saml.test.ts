import { getSaml, SAML_NOT_CONFIGURED } from "@/lib/saml";

describe("saml", () => {
  const ORIGINAL = process.env;

  beforeEach(() => {
    process.env = { ...ORIGINAL };
  });
  afterAll(() => {
    process.env = ORIGINAL;
  });

  it("retorna null quando nao configurado", () => {
    delete process.env.SAML_ENTRY_POINT;
    delete process.env.SAML_IDP_CERT;
    expect(getSaml()).toBeNull();
    expect(SAML_NOT_CONFIGURED.error).toContain("SAML");
  });

  it("cria o Service Provider quando configurado", () => {
    process.env.SAML_ENTRY_POINT = "https://idp.example.com/sso";
    process.env.SAML_IDP_CERT =
      "MIIDdummybase64certforunittestonlynotarealcertificatevalue==";
    process.env.SAML_ISSUER = "test-sp";
    const saml = getSaml();
    expect(saml).not.toBeNull();
  });
});
