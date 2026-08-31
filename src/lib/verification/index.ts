import type { VerificationSource } from "@/types/vinyl";

export interface VerificationResult {
  valid: boolean;
  albumExternalId: string;
  transactionId: string;
  source: VerificationSource;
  isLimitedEdition?: boolean;
  metadata?: Record<string, unknown>;
}

/** Verifica compra en Qobuz mediante API de partner (sin capturas) */
export async function verifyQobuzPurchase(
  userId: string,
  purchaseToken: string
): Promise<VerificationResult | null> {
  const res = await fetch("https://www.qobuz.com/api/v2/purchase/verify", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Api-Key": process.env.QOBUZ_API_KEY!,
    },
    body: JSON.stringify({ user_id: userId, token: purchaseToken }),
  });

  if (!res.ok) return null;

  const data = await res.json();
  return {
    valid: true,
    albumExternalId: data.album_id,
    transactionId: `qobuz_${data.order_id}`,
    source: "qobuz",
    metadata: { format: data.format, bitrate: data.bitrate },
  };
}

/** Verifica compra Bandcamp vía OAuth de la cuenta del usuario */
export async function verifyBandcampPurchase(
  accessToken: string,
  albumUrl: string
): Promise<VerificationResult | null> {
  const res = await fetch(
    `https://bandcamp.com/api/mobile/1/my_collection?page=1`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  if (!res.ok) return null;

  const data = await res.json();
  const match = data.items?.find(
    (item: { item_url: string; sale_item_id: number }) =>
      item.item_url === albumUrl
  );

  if (!match) return null;

  return {
    valid: true,
    albumExternalId: albumUrl,
    transactionId: `bandcamp_${match.sale_item_id}`,
    source: "bandcamp",
    isLimitedEdition: match.is_limited ?? false,
  };
}

/** Canjea un código de descarga único generado por el sello/artista */
export async function redeemDownloadCode(
  code: string,
  userId: string
): Promise<VerificationResult | null> {
  // La validación real ocurre en Supabase (tabla download_codes)
  // Este stub define el contrato del servicio
  return {
    valid: true,
    albumExternalId: "",
    transactionId: `code_${code}`,
    source: "download_code",
    metadata: { redeemed_by: userId },
  };
}
