import { Product, Supplier } from '@shared/api';

export interface OrderItem {
  productId: string;
  quantity: number;
}

export interface Order {
  _id: string;
  supplierId: string;
  items: OrderItem[];
  date: string;
  status: 'draft' | 'sent' | 'archived';
}

/**
 * Generate a formatted WhatsApp message for the order
 */
export function generateOrderMessage(
  supplier: Supplier,
  items: OrderItem[],
  products: Product[],
  note?: string
): string {
  const timestamp = new Date().toLocaleString('fr-FR');
  
  // Build items list
  const itemsList = items
    .map((item) => {
      const product = products.find((p) => p._id === item.productId);
      if (!product) return '';
      return `• ${product.nom} - Quantité: ${item.quantity}`;
    })
    .filter((line) => line)
    .join('\n');

  // Build message
  const message = `
*COMMANDE DE STOCK*

📋 *Fournisseur:* ${supplier.nom}
📱 *Contact:* ${supplier.contact_principal || 'N/A'}
🕐 *Date:* ${timestamp}

*Produits à approvisionner:*
${itemsList}

${note ? `\n*Note:* ${note}\n` : ''}
*Répondez à cette commande dès réception.*
  `.trim();

  return message;
}

/**
 * Generate WhatsApp link for sending message
 */
export function generateWhatsAppLink(
  phoneNumber: string,
  message: string
): string {
  // WhatsApp API: https://wa.me/{phoneNumber}?text={message}
  // Remove +, spaces, and special chars from phone number
  const cleanPhone = phoneNumber.replace(/[^\d+]/g, '').replace(/^\+/, '');
  
  // Encode message
  const encodedMessage = encodeURIComponent(message);
  
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}

/**
 * Send order via WhatsApp (opens WhatsApp Web or app)
 */
export function sendOrderViaWhatsApp(
  supplier: Supplier,
  items: OrderItem[],
  products: Product[],
  note?: string
): void {
  const message = generateOrderMessage(supplier, items, products, note);
  const whatsappLink = generateWhatsAppLink(supplier.telephone, message);
  
  // Open WhatsApp Web or app
  window.open(whatsappLink, '_blank');
}
