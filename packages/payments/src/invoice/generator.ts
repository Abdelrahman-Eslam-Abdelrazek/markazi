interface InvoiceData {
  invoiceNumber: string;
  centerName: string;
  centerLogo?: string;
  studentName: string;
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
  issuedAt: Date;
  dueDate?: Date;
}

export class InvoiceGenerator {
  async generatePdf(_data: InvoiceData): Promise<Buffer> {
    // TODO: Implement PDF generation using @react-pdf/renderer
    throw new Error("Not implemented");
  }

  formatInvoiceNumber(centerId: string, sequence: number): string {
    const year = new Date().getFullYear();
    const paddedSequence = String(sequence).padStart(6, "0");
    return `INV-${year}-${paddedSequence}`;
  }
}
