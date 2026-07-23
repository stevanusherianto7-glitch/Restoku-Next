import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CashierCalculatorModal } from "./CashierCalculatorModal";

describe("CashierCalculatorModal", () => {
  it("renders correctly when open with total amount", () => {
    render(
      <CashierCalculatorModal
        isOpen={true}
        onClose={vi.fn()}
        totalAmount={32200}
        paymentMethod="cash"
        onConfirmPayment={vi.fn()}
      />
    );

    expect(screen.getByText("Modul Kalkulator Kasir")).toBeInTheDocument();
    expect(screen.getByText("Rp 32.200")).toBeInTheDocument();
  });

  it("does not render when isOpen is false", () => {
    const { container } = render(
      <CashierCalculatorModal
        isOpen={false}
        onClose={vi.fn()}
        totalAmount={32200}
        paymentMethod="cash"
        onConfirmPayment={vi.fn()}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  it("calculates change correctly when quick cash preset button is clicked", () => {
    render(
      <CashierCalculatorModal
        isOpen={true}
        onClose={vi.fn()}
        totalAmount={32200}
        paymentMethod="cash"
        onConfirmPayment={vi.fn()}
      />
    );

    // Click 50k quick nominal preset
    const preset50k = screen.getByText("50k");
    fireEvent.click(preset50k);

    // Change should be 50.000 - 32.200 = 17.800
    expect(screen.getByText("Rp 17.800")).toBeInTheDocument();
  });

  it("triggers onConfirmPayment with paid amount and change", () => {
    const onConfirmPayment = vi.fn();
    render(
      <CashierCalculatorModal
        isOpen={true}
        onClose={vi.fn()}
        totalAmount={32200}
        paymentMethod="cash"
        onConfirmPayment={onConfirmPayment}
      />
    );

    // Click Uang Pas
    const uangPasBtn = screen.getByText("Uang Pas");
    fireEvent.click(uangPasBtn);

    // Submit form
    const submitBtn = screen.getByText(/PROSES BAYAR & CETAK STRUK/i);
    fireEvent.click(submitBtn);

    expect(onConfirmPayment).toHaveBeenCalledWith(32200, 0);
  });
});
