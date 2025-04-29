import { useEffect, useRef } from 'react';

interface MercadoPagoButtonProps {
  preferenceId: string;
}

/**
 * Botón de Mercado Pago que inserta el script dinámicamente.
 * @param preferenceId string - El ID de preferencia generado desde Mercado Pago
 */
export default function MercadoPagoButton({ preferenceId }: MercadoPagoButtonProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!preferenceId) return;
    // Limpia scripts anteriores
    if (ref.current) ref.current.innerHTML = '';
    const script = document.createElement('script');
    script.src = 'https://www.mercadopago.com.co/integrations/v1/web-payment-checkout.js';
    script.setAttribute('data-preference-id', preferenceId);
    script.setAttribute('data-source', 'button');
    if (ref.current) ref.current.appendChild(script);
  }, [preferenceId]);

  return <div ref={ref} />;
}
