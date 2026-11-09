"use client";

import PageHeader from "@/src/components/common/PageHeader"; // adjust path if different
import { ChevronDown, ChevronRight, ChevronUp, Save, Search } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ALL_PERMISSION_IDS,
  PERMISSION_GROUPS,
  PermissionGroup,
  Role,
  ROLES,
} from "./PrivilegeData";

import User from "../../../public/icons/user.png";
import Allowed from "../../../public/icons/allowed.png";
import Restricted from "../../../public/icons/restricted.png";

/* ----------------------------- small helpers ----------------------------- */

function Radio({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={`flex size-4 shrink-0 items-center justify-center rounded-full border transition-colors ${
        checked ? "border-[#F24DEB] bg-[#F24DEB]" : "border-[#414141] bg-transparent"
      }`}
    >
      {checked && <span className="size-1.5 rounded-full bg-white" />}
    </button>
  );
}

/* ------------------------------ role selector ----------------------------- */

function RoleSelector({
  role,
  onChange,
}: {
  role: Role;
  onChange: (r: Role) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div ref={ref} className="relative w-full sm:w-[247px]">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex h-10 w-full items-center justify-between rounded-[10px] bg-[#F24DEB] px-5 font-poppins text-[12px] font-normal text-white"
      >
        {role}
        {open ? <ChevronRight className="size-4" /> : <ChevronDown className="size-4" />}
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 top-full z-20 mt-1 w-full rounded-[10px] bg-[#E5E5E5] p-1 shadow-sm"
        >
          {ROLES.map((r) => (
            <li key={r} role="option" aria-selected={r === role}>
              <button
                type="button"
                onClick={() => {
                  onChange(r);
                  setOpen(false);
                }}
                className={`w-full rounded-md px-3 py-2 text-left font-poppins text-[12px] text-black hover:bg-[#C9C9C9] ${
                  r === role ? "bg-[#C9C9C9]" : ""
                }`}
              >
                {r}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ----------------------------- permission group ---------------------------- */

function GroupCard({
  group,
  permissions,
  selected,
  forceOpen,
  onToggle,
  onToggleGroup,
}: {
  group: PermissionGroup;
  permissions: PermissionGroup["permissions"]; // already filtered by search
  selected: Set<string>;
  forceOpen: boolean;
  onToggle: (id: string) => void;
  onToggleGroup: (ids: string[], allOn: boolean) => void;
}) {
  const [open, setOpen] = useState(false);
  const expanded = open || forceOpen;

  const Icon = group.icon; // capital I, so React treats it as a component

  const allIds = group.permissions.map((p) => p.id);
  const count = allIds.filter((id) => selected.has(id)).length;
  const allOn = count === allIds.length;

  return (
    <div className="rounded-[10px] border border-[#DADADA] bg-[#E5E5E5] px-4 py-3.5">
      <button
        type="button"
        aria-expanded={expanded}
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-3 text-left"
      >
        <span className="flex min-w-0 items-center gap-3">
          <Icon className="size-5 shrink-0 text-[#F24DEB]" strokeWidth={1.5} />
       <span className="min-w-0">
  <span className="block truncate font-poppins text-[12px] font-medium capitalize leading-[1.4] text-[#F24DEB]">
    {group.title}
  </span>
  <span className="mt-1 block font-poppins text-[10px] font-normal leading-[1.4] text-[#414141]">
    {count} of {allIds.length} permissions
  </span>
</span>
        </span>
        {expanded ? (
          <ChevronRight className="size-4 shrink-0 text-black" />
        ) : (
          <ChevronDown className="size-4 shrink-0 text-black" />
        )}
      </button>

      {expanded && (
        <div className="mt-3 border-t border-[#BDBDBD] pt-3.5">
          <div className="flex items-center justify-between">
            <span className="font-poppins text-[12px] font-normal text-[#848484]">
              {count} of {allIds.length} permissions
            </span>
            <label className="flex cursor-pointer items-center gap-2 font-poppins text-[12px] font-normal uppercase text-[#848484]">
              <Radio
                checked={allOn}
                label={`Select all ${group.title} permissions`}
                onChange={() => onToggleGroup(allIds, allOn)}
              />
              All
            </label>
          </div>

          <ul className="mt-3 flex flex-col gap-3.5">
            {permissions.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-3">
                <span className="font-poppins text-[14px] font-normal leading-[100%] text-[#414141]">
                  {p.label}
                </span>
                <Radio
                  checked={selected.has(p.id)}
                  label={p.label}
                  onChange={() => onToggle(p.id)}
                />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/* --------------------------------- page ------------------------------------ */

export default function PrivilegeSettings({
  onSave,
}: {
  onSave?: (role: Role, permissions: string[]) => void;
}) {
  const [role, setRole] = useState<Role>("Administrator");
  const [search, setSearch] = useState("");

  // permissions per role (replace initial state with API data)
  const [byRole, setByRole] = useState<Record<Role, Set<string>>>(() => ({
    Administrator: new Set(ALL_PERMISSION_IDS),
    "Store Manager": new Set(),
    Cashier: new Set(),
    Accountant: new Set(),
    "Inventory Staff": new Set(),
  }));

  const selected = byRole[role];
  const total = ALL_PERMISSION_IDS.length;
  const allowed = selected.size;
  const restricted = total - allowed;
  const percent = total ? (allowed / total) * 100 : 0;

  const update = (fn: (s: Set<string>) => void) =>
    setByRole((prev) => {
      const next = new Set(prev[role]);
      fn(next);
      return { ...prev, [role]: next };
    });

  const toggle = (id: string) =>
    update((s) => (s.has(id) ? s.delete(id) : s.add(id)));

  const toggleGroup = (ids: string[], allOn: boolean) =>
    update((s) => ids.forEach((id) => (allOn ? s.delete(id) : s.add(id))));

  const allSelected = allowed === total;
  const toggleAll = () =>
    update((s) =>
      ALL_PERMISSION_IDS.forEach((id) => (allSelected ? s.delete(id) : s.add(id))),
    );

  const reset = () => setByRole((prev) => ({ ...prev, [role]: new Set() }));

  const query = search.trim().toLowerCase();
  const visibleGroups = useMemo(
    () =>
      PERMISSION_GROUPS.map((g) => ({
        group: g,
        permissions: query
          ? g.permissions.filter((p) => p.label.toLowerCase().includes(query))
          : g.permissions,
      })).filter((x) => x.permissions.length > 0),
    [query],
  );

  return (
    <div className="flex flex-col gap-3 font-poppins">
      {/* Select user role */}
      <PageHeader
        title="Select User Role"
        subtitle="Configure User Roles & Permissions"
        icon={User}
        rightContent={<RoleSelector role={role} onChange={setRole} />}
      />

      {/* Summary */}
      <section className="flex flex-col gap-3 rounded-[10px] bg-[#EFEFEF] p-4 sm:px-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-[16px] font-semibold capitalize leading-[100%] text-black">
            Configure access for {role}
          </h2>
          <span className="shrink-0 text-[10px] font-normal leading-[100%] text-[#848484]">
            {allowed} / {total} allowed
          </span>
        </div>

        <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#D0D0D0]">
          <div
            className="h-full rounded-full bg-[#F24DEB] transition-[width] duration-300"
            style={{ width: `${percent}%` }}
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="flex min-h-[99px] flex-col justify-between rounded-[10px] border border-[#0EA300] bg-[#B0F5973D] pb-[13px] pl-[15px] pr-[14px] pt-[14px]">
            <div className="flex items-center gap-2">
              <span className="flex shrink-0 items-center justify-center rounded-[5px]">
                <Image src={Allowed} alt="" className="size-8" />
              </span>
              <span className="text-[12px] font-normal uppercase leading-[100%] text-[#0EA300]">
                Allowed
              </span>
            </div>
            <span className="text-[18px] font-semibold leading-[100%] text-black">
              {allowed}
            </span>
          </div>

          <div className="flex min-h-[99px] flex-col justify-between rounded-[10px] border border-[#FF0000] bg-[#FF00001A] pb-[13px] pl-[15px] pr-[14px] pt-[14px]">
            <div className="flex items-center gap-2">
              <span className="flex shrink-0 items-center justify-center rounded-[5px]">
                <Image src={Restricted} alt="" className="size-8" />
              </span>
              <span className="text-[12px] font-normal uppercase leading-[100%] text-[#FF0000]">
                Restricted
              </span>
            </div>
            <span className="text-[18px] font-semibold leading-[100%] text-black">
              {restricted}
            </span>
          </div>
        </div>
      </section>

      {/* Permissions */}
      <section className="flex flex-col gap-3 rounded-[10px] bg-[#EFEFEF] p-4 sm:px-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-[16px] font-semibold leading-[100%] text-black">
            Configure access for {role}
          </h2>
          <label className="flex shrink-0 cursor-pointer items-center gap-2 rounded-full border border-[#BDBDBD] bg-[#E9E9E9] px-3 py-1 font-poppins text-[12px] font-normal text-[#848484]">
            <Radio
              checked={allSelected}
              label="Select all permissions"
              onChange={toggleAll}
            />
            Select All
          </label>
        </div>

        <div className="flex h-[34px] items-center gap-2 rounded-full border border-[#D0D0D0] bg-[#E5E5E5] px-3">
          <Search className="size-[18px] shrink-0 text-[#414141]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Permissions..."
            className="w-full bg-transparent font-poppins text-[12px] text-black outline-none placeholder:text-[#848484]"
          />
        </div>

        {visibleGroups.length === 0 ? (
          <p className="py-6 text-center text-[12px] text-[#848484]">
            No permissions found
          </p>
        ) : (
          <div className="grid grid-cols-1 items-start gap-3 md:grid-cols-2">
            {visibleGroups.map(({ group, permissions }) => (
              <GroupCard
                key={group.id}
                group={group}
                permissions={permissions}
                selected={selected}
                forceOpen={!!query}
                onToggle={toggle}
                onToggleGroup={toggleGroup}
              />
            ))}
          </div>
        )}
      </section>

      {/* Actions */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={reset}
          className="h-10 rounded-[10px] border border-[#FF0000] bg-[#FF00001A] px-6 text-[12px] font-semibold uppercase text-[#FF0000] sm:w-[30%]"
        >
          Reset
        </button>
        <button
          type="button"
          onClick={() => onSave?.(role, Array.from(selected))}
          className="flex h-10 flex-1 items-center justify-center gap-2 rounded-[10px] bg-[#F24DEB] text-[12px] font-semibold uppercase text-white"
        >
          <Save className="size-4" />
          Save
        </button>
      </div>
    </div>
  );
}