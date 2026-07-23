import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SplitBillModal } from "./SplitBillModal";
import type { PosCartItem } from "@features/pos/ui/stores/usePosCartStore";
import { createMenuId, createCategoryId } from "@features/menu/domain/entities/MenuItem";

const MOCK_ITEMS: PosCartItem[] = [
  {
    menu: {
      id: createMenuId("menu-1"),
      name: "Bakmi Godog Jawa",
      description: null,
      price: 28000,
      category_id: createCategoryId("cat-makanan"),
      category: "makanan",
      image_url: null,
      status: "active",
      is_popular: false,
      is_new: false,
      is_promo: false,
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
        items={MOCK_ITEMS}
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
        items={MOCK_ITEMS}
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
        items={MOCK_ITEMS}
        totalWithTax={32200}
        onConfirmSplitPayment={onConfirmSplitPayment}
      />
    );

    const payBtn = screen.getByText(/BAYAR BAGIAN INI/i);
    fireEvent.click(payBtn);

    expect(onConfirmSplitPayment).toHaveBeenCalled();
  });
});
