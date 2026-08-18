import type { SelectedPackage } from "./package-selection";

export type PackageDefinition = SelectedPackage & {
  description: string;
};

export const packageCatalog: PackageDefinition[] = [
  {
    packageName: "Procure to Pay",
    packageVersion: "1.0",
    description: "Manage purchases of goods and services for business operations.",
  },
  {
    packageName: "Order to Cash",
    packageVersion: "1.0",
    description: "Manage sales from customer orders through payment collection.",
  },
  {
    packageName: "Inventory Control",
    packageVersion: "1.0",
    description: "Track stock and support efficient inventory operations.",
  },
  {
    packageName: "Financial accounting",
    packageVersion: "1.0",
    description: "Manage organisational finances and financial reporting.",
  },
  {
    packageName: "Account Payable",
    packageVersion: "1.0",
    description: "Manage supplier invoices, payments, and settlement.",
  },
  {
    packageName: "Account Receivable",
    packageVersion: "1.0",
    description: "Record customer receipts, advances, and invoice settlement.",
  },
  {
    packageName: "AxiPayroll",
    packageVersion: "1.0",
    description: "Support payroll processing and employee salary management.",
  },
  {
    packageName: "ERP",
    packageVersion: "1.0",
    description: "Integrate core business processes and operational data.",
  },
];
