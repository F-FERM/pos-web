"use client";

import { AddCustomerDialog, CustomerFormData } from "@/src/components/customer-dues/AddCustomeDuesDialog";
import SearchBar from "@/src/components/common/PosSearchBar";
import { Button } from "@/src/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import {
  Camera,
  ChevronDown,
  CircleCheck,
  Minus,
  Plus,
  RotateCcw,
  ScanBarcode,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  unit: string;
};

type PosCustomer = { id: string; name: string; mobile: string };

const PRODUCTS: Product[] = [
  { id: "1", name: "Fortune sunlight Sunflower Oil 1L", category: "Oil & Ghee", price: 109, quantity: 45, unit: "Pac" },
  { id: "2", name: "aashirvaad shudh chakki atta", category: "Grains & Atta", price: 285, quantity: 30, unit: "Bag" },
  { id: "3", name: "tata salt vacuum 1 kg", category: "Spices & Salt", price: 28, quantity: 120, unit: "Pac" },
  { id: "4", name: "royal sona masoori rice", category: "Salt & Pulses", price: 380, quantity: 8, unit: "Bag" },
  { id: "5", name: "toor dal premium 1kg", category: "Salt & Pulses", price: 109, quantity: 25, unit: "Kg" },
  { id: "6", name: "tata tea premium 250", category: "Beverages", price: 135, quantity: 50, unit: "Pac" },
  { id: "7", name: "Fortune sunlight Sunflower Oil 1L", category: "Diary & Bakers", price: 58, quantity: 18, unit: "Pac" },
  { id: "8", name: "surf excel easy wash", category: "Households", price: 142, quantity: 32, unit: "Pac" },
  { id: "9", name: "dettol original soap", category: "Personal Care", price: 148, quantity: 45, unit: "Pac" },
  { id: "10", name: "colgate strong teeth", category: "Personal Care", price: 65, quantity: 45, unit: "Pac" },
  { id: "11", name: "britannia good day", category: "Snakes & Biscuits", price: 30, quantity: 45, unit: "Pac" },
  { id: "12", name: "catch turmeric powder", category: "Spices & Salt", price: 42, quantity: 45, unit: "Pac" },
  { id: "13", name: "Fortune sunlight Sunflower Oil 1L", category: "Combos & Packs", price: 200, quantity: 45, unit: "Pac" },
  { id: "14", name: "britannia good day", category: "Snakes & Biscuits", price: 30, quantity: 45, unit: "Pac" },
  { id: "15", name: "catch turmeric powder", category: "Spices & Salt", price: 42, quantity: 45, unit: "Pac" },
  { id: "16", name: "Fortune sunlight Sunflower Oil 1L", category: "Combos & Packs", price: 200, quantity: 45, unit: "Pac" },
  { id: "17", name: "britannia good day", category: "Snakes & Biswwwcuits", price: 30, quantity: 45, unit: "Pac" },
  { id: "18", name: "catch turmeric powder", category: "Spices & Swwwalt", price: 42, quantity: 45, unit: "Pac" },
  { id: "19", name: "Fortune sunlight Sunflower Oil 1L", category: "Combowwws & Packs", price: 200, quantity: 45, unit: "Pac" },
  { id: "20", name: "britannia good day", category: "Snakewwws & Biscuits", price: 30, quantity: 45, unit: "Pac" },
  { id: "21", name: "catch turmeric powder", category: "Spicwwwes & Salt", price: 42, quantity: 45, unit: "Pac" },
  { id: "22", name: "Fortune sunlight Sunflower Oil 1L", category: "Cowwwmbos & Packs", price: 200, quantity: 45, unit: "Pac" },
  { id: "23", name: "britannia good day", category: "Snawwwwkes & Biscuits", price: 30, quantity: 45, unit: "Pac" },
  { id: "24", name: "catch turmeric powder", category: "Spices & Swwwalt", price: 42, quantity: 45, unit: "Pac" },
  { id: "25", name: "Fortune sunlight Sunflower Oil 1L", category: "Coddddmbos & Packs", price: 200, quantity: 45, unit: "Pac" },
  { id: "26", name: "britannia good day", category: "Snakes & Bidddscuits", price: 30, quantity: 45, unit: "Pac" },
  { id: "27", name: "catch turmeric powder", category: "Spices & Svvvalt", price: 42, quantity: 45, unit: "Pac" },
  { id: "28", name: "Fortune sunlight Sunflower Oil 1L", category: "Combovvvs & Packs", price: 200, quantity: 45, unit: "Pac" },
  
];

// Dummy data (replace with your customer API later)
const CUSTOMERS: PosCustomer[] = [
  { id: "1", name: "Rahul Sharma", mobile: "9876543210" },
  { id: "2", name: "Anita Menon", mobile: "9895012345" },
  { id: "3", name: "Fresh Mart Traders", mobile: "9447788990" },
  { id: "4", name: "Joseph Thomas", mobile: "9961234567" },
  { id: "5", name: "Meera Nair", mobile: "9846098460" },
];

type CartItem = { product: Product; qty: number };
const PAYMENT_MODES = ["Cash", "UPI", "Card", "Credit"] as const;
type PaymentMode = (typeof PAYMENT_MODES)[number];
const CURRENCY = "₹";
const round2 = (n: number) => Math.round(n * 100) / 100;

// shared look for the small inputs in the cart panel
const customerInput =
  "h-[30px] w-full rounded-[10px] border border-[#C0C0C0] bg-[#EDEDED] px-3 text-[12px] text-[#484848] outline-none placeholder:text-[#BFBFBF] focus:border-[#F24DEB]";
const amountInput =
  "h-6 w-[108px] rounded-[10px] border border-[#C0C0C0] bg-[#EDEDED] px-2 text-right text-[12px] text-[#484848] outline-none focus:border-[#F24DEB]";
// bigger touch target on small screens, compact on desktop
const qtyButton =
  "flex size-8 items-center justify-center rounded-[6px] border border-[#C0C0C0] bg-[#EDEDED] text-black transition-colors hover:border-[#F24DEB] lg:size-6";

export default function PosBillingPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  // cart state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customers, setCustomers] = useState<PosCustomer[]>(CUSTOMERS);
  const [customerId, setCustomerId] = useState(""); // "" = walk-in customer
  const [customerPhone, setCustomerPhone] = useState("");
  const [addCustomerOpen, setAddCustomerOpen] = useState(false);
  const [discountInput, setDiscountInput] = useState("");
  const [taxInput, setTaxInput] = useState("");
  const [paymentMode, setPaymentMode] = useState<PaymentMode>("Cash");
  const [receivedInput, setReceivedInput] = useState("");

  const addToCart = (product: Product) =>
    setCart((prev) => {
      const found = prev.find((i) => i.product.id === product.id);
      if (!found) return [...prev, { product, qty: 1 }];
      if (found.qty >= product.quantity) return prev;
      return prev.map((i) => (i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i));
    });

  const changeQty = (id: string, delta: number) =>
    setCart((prev) =>
      prev
        .map((i) =>
          i.product.id === id
            ? { ...i, qty: Math.min(i.product.quantity, i.qty + delta) }
            : i,
        )
        .filter((i) => i.qty > 0),
    );

  const removeItem = (id: string) => setCart((prev) => prev.filter((i) => i.product.id !== id));

  // picking a customer fills in the phone number; walk-in clears it
  const handleSelectCustomer = (id: string) => {
    setCustomerId(id);
    const c = customers.find((x) => x.id === id);
    setCustomerPhone(c?.mobile ?? "");
  };

  // new customer from the plus dialog: add to the list and select it
  const handleCreateCustomer = (data: CustomerFormData) => {
    const created: PosCustomer = {
      id: crypto.randomUUID(),
      name: data.fullName,
      mobile: data.mobile ?? "",
    };
    // TODO: call your create-customer API here
    setCustomers((prev) => [created, ...prev]);
    setCustomerId(created.id);
    setCustomerPhone(created.mobile);
  };

  const resetBill = () => {
    setCart([]);
    setCustomerId("");
    setCustomerPhone("");
    setDiscountInput("");
    setTaxInput("");
    setReceivedInput("");
  };

  // totals
  const subtotal = cart.reduce((sum, i) => sum + i.product.price * i.qty, 0);
  const discount = Math.min(parseFloat(discountInput) || 0, subtotal);
  const taxAmount = ((subtotal - discount) * (parseFloat(taxInput) || 0)) / 100;
  const grandTotal = round2(subtotal - discount + taxAmount);
  const received = parseFloat(receivedInput) || 0;
  const changeDue = Math.max(0, round2(received - grandTotal));

  const handleCheckout = () => {
    if (cart.length === 0) return;
    // TODO: call your create-sale API here
    // customer name: customers.find((c) => c.id === customerId)?.name ?? "Walk-in Customer"
    resetBill();
  };

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(PRODUCTS.map((p) => p.category)))],
    [],
  );

  const filtered = useMemo(
    () =>
      PRODUCTS.filter(
        (p) =>
          (category === "All" || p.category === category) &&
          p.name.toLowerCase().includes(query.trim().toLowerCase()),
      ),
    [category, query],
  );

  return (
    <div className="flex flex-col gap-3 lg:h-[calc(100dvh-71px-1.5rem)] lg:flex-row lg:px-2">
      {/* ───────────── LEFT SECTION ───────────── */}
      <section className="flex min-h-[460px] min-w-0 flex-1 flex-col gap-3 overflow-hidden rounded-[10px] border border-[#DADADA] bg-[#EFEFEF] p-3 sm:p-5 lg:min-h-0">
        {/* Scanner + Camera Backup */}
        <div className="flex w-full items-center justify-between gap-3">
          <SearchBar
            icon={ScanBarcode}
            iconClassName="text-[#F24DEB]"
            placeholder="Scan Barcode with scanner"
            value={query}
            onSearch={setQuery}
            className="min-w-0 max-w-none flex-1 [&_input::placeholder]:text-[#AFAFAF]"
          />

          <Button variant="cameraBackup" className="shrink-0" aria-label="Camera Backup">
            <Camera className="text-[#F24DEB]" />
            <span className="hidden sm:inline">Camera Backup</span>
          </Button>
        </div>

        {/* Category tabs: one row, scrolls sideways on every screen size */}
        <Tabs value={category} onValueChange={setCategory} className="min-w-0">
          <TabsList
            variant="pills"
            onWheel={(e) => {
              // mouse wheel scrolls the row sideways on desktop
              if (e.deltaY !== 0) e.currentTarget.scrollLeft += e.deltaY;
            }}
            className="h-auto w-full flex-nowrap justify-start gap-2 overflow-x-auto overflow-y-hidden bg-transparent p-0 pb-1 [scrollbar-width:thin]"
          >
            {categories.map((cat) => (
              <TabsTrigger
                key={cat}
                variant="category"
                value={cat}
                className="shrink-0 whitespace-nowrap"
              >
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Product grid */}
        <div className="grid max-h-[60dvh] flex-1 grid-cols-[repeat(auto-fill,minmax(135px,1fr))] content-start gap-3 overflow-y-auto p-1 [scrollbar-width:thin] sm:grid-cols-[repeat(auto-fill,minmax(165px,1fr))] lg:max-h-none">
          {filtered.length === 0 ? (
            <p className="col-span-full py-12 text-center text-[12px] text-[#AFAFAF]">
              No products found.
            </p>
          ) : (
            filtered.map((p) => {
              const out = p.quantity <= 0;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => addToCart(p)}
                  disabled={out}
                  className={`flex min-w-0 flex-col items-stretch rounded-[10px] border border-transparent bg-[#FFFFFF33] p-3 text-left shadow-[0px_0px_4px_0px_#00000040] transition-colors hover:border-primary ${
                    out ? "cursor-not-allowed opacity-60" : "cursor-pointer"
                  }`}
                >
                  {/* Category badge */}
                  <span className="mb-3 inline-flex h-[18px] w-fit max-w-full items-center rounded-[20px] border-[0.5px] border-[#AFAFAF] bg-[#BFBFBF73] px-[9px] text-[10px] font-normal text-black">
                    <span className="block truncate leading-[14px]" title={p.category}>
                      {p.category}
                    </span>
                  </span>

                  {/* Name + divider */}
                  <div className="mt-auto border-b-[0.5px] border-[#898989] pb-[6px]">
                    <h6
                      title={p.name}
                      className="line-clamp-2 break-words text-[13px] font-medium leading-[1.4] text-black"
                    >
                      {p.name}
                    </h6>
                  </div>

                  {/* Price / pieces: always sits right under the divider */}
                  <div className="box-content flex h-[15px] w-full items-center justify-between gap-1 pt-[10px]">
                    <span className="shrink-0 text-[12px] font-semibold leading-[100%] tracking-[0%] text-black">
                      ₹ {p.price}
                    </span>
                    <span className="truncate text-[10px] font-normal leading-[100%] tracking-[0%] text-[#AFAFAF]">
                      {out ? "Out of stock" : `${p.quantity} ${p.unit}`}
                    </span>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </section>

      {/* ───────────── RIGHT SECTION ───────────── */}
      <section className="flex min-h-[420px] w-full shrink-0 flex-col overflow-hidden rounded-[10px] border border-[#DADADA] bg-[#EFEFEF] lg:min-h-0 lg:w-[clamp(320px,32vw,430px)]">
        {/* Cart header + customer */}
        <div className="shrink-0 space-y-3 bg-[#E5E5E5] px-4 pb-2 pt-4">
          <div className="flex items-center justify-between gap-1">
            <h3 className="flex min-w-0 items-center gap-2 text-[15px] font-medium text-[#484848]">
              <ShoppingBag className="size-[22px] shrink-0 text-[#F24DEB]" />
              <span className="truncate">Current Billing Cart ({cart.length})</span>
            </h3>
            {cart.length > 0 && (
              <button
                type="button"
                onClick={resetBill}
                className="flex shrink-0 items-center gap-1 text-[12px] text-red-500 hover:underline"
              >
                <RotateCcw className="size-3" />
                Clear
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3 min-[400px]:grid-cols-2">
            {/* Customer name dropdown */}
            <label className="flex min-w-0 flex-col gap-1.5 text-[12px] text-[#484848]">
              Customer Name
              <span className="relative">
                <select
                  value={customerId}
                  onChange={(e) => handleSelectCustomer(e.target.value)}
                  className={`${customerInput} appearance-none truncate pr-8`}
                >
                  <option value="">Customer Name</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-4 -translate-y-1/2 text-[#848484]" />
              </span>
            </label>

            {/* Phone number + add customer plus button */}
            <div className="flex min-w-0 flex-col gap-1.5 text-[12px] text-[#484848]">
              <label htmlFor="pos-customer-phone">Phone Number</label>
              <div className="flex items-center gap-2">
                <input
                  id="pos-customer-phone"
                  type="tel"
                  placeholder="Optional"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className={customerInput}
                />
                <button
                  type="button"
                  aria-label="Add new customer"
                  onClick={() => setAddCustomerOpen(true)}
                  className="flex size-[30px] shrink-0 items-center justify-center rounded-[10px] bg-[#F24DEB] text-white transition-colors hover:bg-[#D93CD2]"
                >
                  <Plus className="size-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Cart items */}
        <div className="max-h-[320px] min-h-[140px] flex-1 space-y-2 overflow-y-auto border-y border-[#D5D5D5] bg-[#F2F2F2] p-3 [scrollbar-width:thin] lg:max-h-none lg:min-h-[96px]">
          {cart.length === 0 ? (
            <div className="flex h-full min-h-[120px] flex-col items-center justify-center gap-2 text-center text-[#AFAFAF]">
              <ShoppingBag className="size-10 stroke-1" />
              <p className="text-[12px] font-medium">Cart is currently empty</p>
              <p className="text-[10px]">Scan a barcode or tap a product card.</p>
            </div>
          ) : (
            cart.map(({ product, qty }) => (
              <div
                key={product.id}
                className="flex items-center justify-between gap-2 rounded-[14px] border border-[#D5D5D5] bg-[#EAEAEA] px-3 py-2"
              >
                <div className="min-w-0">
                  <h5
                    title={product.name}
                    className="line-clamp-2 break-words text-[12px] font-medium text-black"
                  >
                    {product.name}
                  </h5>
                  <p className="text-[10px] text-[#848484]">
                    {CURRENCY} {product.price} x {qty} = {CURRENCY} {round2(product.price * qty)}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    className={qtyButton}
                    onClick={() => changeQty(product.id, -1)}
                  >
                    <Minus className="size-3.5" />
                  </button>
                  <span className="w-4 text-center text-[12px] text-black">{qty}</span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    className={qtyButton}
                    onClick={() => changeQty(product.id, 1)}
                  >
                    <Plus className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    aria-label="Remove item"
                    className="ml-1 flex size-8 items-center justify-center text-red-500 transition-colors hover:text-red-600 lg:size-auto"
                    onClick={() => removeItem(product.id)}
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Totals + payment + checkout (compacts on short screens) */}
        <div className="shrink-0 space-y-3 bg-[#E5E5E5] px-4 py-4 text-[12px] text-[#848484] [@media(max-height:760px)]:space-y-2 [@media(max-height:760px)]:py-3">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[#484848]">Subtotal</span>
              <span className="text-[#434343]">{CURRENCY} {round2(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-[#484848]">Discount ({CURRENCY})</span>
              <input
                type="number"
                min="0"
                value={discountInput}
                onChange={(e) => setDiscountInput(e.target.value)}
                className={amountInput}
              />
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-[#484848]">GST / Tax Rate (%)</span>
              <input
                type="number"
                min="0"
                value={taxInput}
                onChange={(e) => setTaxInput(e.target.value)}
                className={amountInput}
              />
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-[#BDBDBD] pt-3 text-[14px] font-semibold text-black">
            <span>Grand Total</span>
            <span>{CURRENCY} {grandTotal}</span>
          </div>

          {/* Payment mode: 2x2 on tiny phones, 4 across otherwise */}
          <Tabs
            value={paymentMode}
            onValueChange={(v) => setPaymentMode(v as PaymentMode)}
          >
            <TabsList
              variant="pills"
              className="grid h-auto w-full grid-cols-2 gap-2 bg-transparent p-0 min-[360px]:grid-cols-4"
            >
              {PAYMENT_MODES.map((mode) => (
                <TabsTrigger key={mode} variant="payment" value={mode} className="w-full">
                  {mode}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {/* Cash received */}
          {paymentMode === "Cash" && (
            <div className="space-y-2 rounded-[10px] border border-[#57135433] bg-[#FF00F50F] px-3 py-2">
              <div className="flex items-center justify-between gap-2 text-[#484848]">
                <span>Amount Received ({CURRENCY}):</span>
                <input
                  type="number"
                  min="0"
                  placeholder={String(grandTotal)}
                  value={receivedInput}
                  onChange={(e) => setReceivedInput(e.target.value)}
                  className="h-6 w-[108px] rounded-[10px] border border-[#DDB9DA] bg-[#F3E6F2] px-2 text-right text-[12px] text-[#8B8B8B] outline-none placeholder:text-[#AFAFAF] focus:border-[#F24DEB]"
                />
              </div>

              <div className="flex items-center justify-between gap-2 border-t border-[#DDB9DA] pt-2">
                <span className="text-[#484848]">Change Due to Customer:</span>
                <span className="font-medium text-[#484848]">{CURRENCY} {changeDue}</span>
              </div>
            </div>
          )}

          <Button
            type="button"
            variant="completeBill"
            onClick={handleCheckout}
            disabled={cart.length === 0}
          >
            <CircleCheck className="size-[18px]" />
            Complete &amp; Bill
          </Button>
        </div>
      </section>

      {/* Add new customer (opened by the plus button next to the phone number) */}
      <AddCustomerDialog
        open={addCustomerOpen}
        onOpenChange={setAddCustomerOpen}
        onSubmit={handleCreateCustomer}
      />
    </div>
  );
}