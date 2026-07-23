import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SplitBillModal } from "./SplitBillModal";

const MOCK_ITEMS = [
  {
    menu: {
      id: "menu-1",
      name: "Bakmi Godog Jawa",
      price: 28000,
      category: "Makanan",
      status: "active" as const,
      created_at: "",
      updated_at: "",
    },
    quantity: 1,
  },
];

describe("SplitBillModal", () => {
  it("renders correctly when open with total amount", () => {
    render(
      <SplitBillModal
        isOpen={true}
        onClose={vi.fn()}
        items={MOCK_ITEMS as any}
        totalWithTax={30800}
        onConfirmSplitPayment={vi.fn()}
      />
    );

    expect(screen.getByText(/Fitur Split Bill/i)).toBeInTheDocument();
    expect(screen.getByText("Rp 30.800")).toBeInTheDocument();
  });

  it("calculates equal share per person correctly", () => {
    render(
      <SplitBillModal
        isOpen={true}
        onClose={vi.fn()}
        items={MOCK_ITEMS as any}
        totalWithTax={32200}
        onConfirmSplitPayment={vi.fn()}
      />
    );

    // Default is 2 people -> 32.200 / 2 = 16.100
    expect(screen.getByText("Rp 16.100")).toBeInTheDocument();
  });

  it("triggers onConfirmSplitPayment on pay button click", () => {
    const onConfirmSplitPayment = vi.fn();
    render(
      <SplitBillModal
        isOpen={true}
        onClose={vi.fn()}
        items={MOCK_ITEMS as any}
        totalWithTax={32200}
        onConfirmSplitPayment={onConfirmSplitPayment}
      />
    );

    const payBtn = screen.getByText(/BAYAR BAGIAN INI/i);
    fireEvent.click(payBtn);

    expect(onConfirmSplitPayment).toHaveBeenCalled();
  });
});
