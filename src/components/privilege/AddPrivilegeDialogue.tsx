"use client";

import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Form } from "@/src/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronDown,
  ChevronRight,
  Landmark,
  Package,
  Search,
  ShieldCheck,
  ShoppingCart,
  Truck,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import FormInput from "../common/form/FormInput";
import { LoadingButton } from "../ui/loading-button";
import { ListModulesWithSubmodulesApi } from "@/src/api/privilege/api/getAll";
import { ListPrivilegeByIdApi } from "@/src/api/privilege/api/getById";
import { useAddPrivilege } from "@/src/api/privilege/hooks/create.hook";
import { useEditPrivilege } from "@/src/api/privilege/hooks/update.hook";

/* --------------------------------- types ---------------------------------- */

interface SubModule {
  _id: string;
  identity: string;
  label: string;
  moduleId: string;
  isActive: boolean;
  isDeleted: boolean;
}

interface ModuleWithSubs {
  _id: string;
  identity: string;
  label: string;
  isActive: boolean;
  isDeleted: boolean;
  subModules: SubModule[];
}

export interface PrivilegePermission {
  subModuleId: string;
  canCreate: boolean;
  canRead: boolean;
  canUpdate: boolean;
  canDelete: boolean;
}

export interface PrivilegePayload {
  name: string;
  description: string;
  modules: string[];
  permissions: PrivilegePermission[];
}

/* -------------------------------- constants ------------------------------- */

// chip label -> API flag
const ACTIONS = ["create", "edit", "view", "delete"] as const;
type Action = (typeof ACTIONS)[number];

const FLAG: Record<Action, keyof Omit<PrivilegePermission, "subModuleId">> = {
  create: "canCreate",
  edit: "canUpdate",
  view: "canRead",
  delete: "canDelete",
};

const MODULE_ICONS: Record<string, LucideIcon> = {
  sales: ShoppingCart,
  inventory: Package,
  purchasing: Truck,
  finance: Landmark,
};

const keyOf = (subModuleId: string, action: Action) => `${subModuleId}:${action}`;

const formSchema = z.object({
  name: z
    .string()
    .min(1, "name is required")
    .max(50, "name must be at most 50 characters"),
  description: z.string().max(200, "Description must be at most 200 characters"),
});

export type PrivilegeFormData = z.infer<typeof formSchema>;

/* ----------------------- in-file ui helpers (not exported) ---------------------- */

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

function ModuleCard({
  module,
  subModules,
  selected,
  forceOpen,
  onToggle,
  onToggleMany,
}: {
  module: ModuleWithSubs;
  subModules: SubModule[];
  selected: Set<string>;
  forceOpen: boolean;
  onToggle: (key: string) => void;
  onToggleMany: (keys: string[], allOn: boolean) => void;
}) {
  const [open, setOpen] = useState(false);
  const expanded = open || forceOpen;
  const Icon = MODULE_ICONS[module.identity] ?? ShieldCheck;

  // counts use ALL submodules of the module, not just the searched ones
  const allKeys = module.subModules.flatMap((sm) => ACTIONS.map((a) => keyOf(sm._id, a)));
  const count = allKeys.filter((k) => selected.has(k)).length;
  const allOn = allKeys.length > 0 && count === allKeys.length;

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
              {module.label}
            </span>
            <span className="mt-1 block font-poppins text-[10px] font-normal leading-[1.4] text-[#414141]">
              {count} of {allKeys.length} permissions
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
              {count} of {allKeys.length} permissions
            </span>
            <label className="flex cursor-pointer items-center gap-2 font-poppins text-[12px] font-normal uppercase text-[#848484]">
              <Radio
                checked={allOn}
                label={`Select all ${module.label} permissions`}
                onChange={() => onToggleMany(allKeys, allOn)}
              />
              All
            </label>
          </div>

          <ul className="mt-3 flex flex-col gap-3.5">
            {subModules.map((sm) => (
              <li
                key={sm._id}
                className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3"
              >
                <span className="font-poppins text-[14px] font-normal leading-[1.3] text-[#414141]">
                  {sm.label}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {ACTIONS.map((a) => {
                    const k = keyOf(sm._id, a);
                    const active = selected.has(k);
                    return (
                      <button
                        key={a}
                        type="button"
                        aria-pressed={active}
                        onClick={() => onToggle(k)}
                        className={`h-7 min-w-[58px] rounded-full border px-3 font-poppins text-[11px] font-normal capitalize transition-colors ${
                          active
                            ? "border-[#F24DEB] bg-[#EFEFEF] text-[#F24DEB]"
                            : "border-[#BDBDBD] bg-[#EFEFEF] text-[#414141] hover:bg-[#D9D9D9]"
                        }`}
                      >
                        {a}
                      </button>
                    );
                  })}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/* --------------------------------- dialog --------------------------------- */

interface AddPrivilegeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEdit?: boolean;
  privilegeId?: string;
}

export function AddPrivilegeDialog({
  open,
  onOpenChange,
  isEdit = false,
  privilegeId,
}: AddPrivilegeDialogProps) {
  const form = useForm<PrivilegeFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        name:"",
        description:""
    },
  });

  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [permissionError, setPermissionError] = useState(false);

  /* ------------------------------ modules query ----------------------------- */

  const { data: modulesData, isLoading } = useQuery({
    queryKey: ["modulesWithSubModules",search],
    queryFn: () => ListModulesWithSubmodulesApi({search:search}),
    enabled: open,
  });

  // only active, non-deleted modules / submodules that actually have submodules
  const modules: ModuleWithSubs[] = useMemo(
    () =>
      ((modulesData?.data ?? []) as ModuleWithSubs[])
        .filter((m) => m.isActive && !m.isDeleted)
        .map((m) => ({
          ...m,
          subModules: (m.subModules ?? []).filter((s) => s.isActive && !s.isDeleted),
        }))
        .filter((m) => m.subModules.length > 0),
    [modulesData],
  );

  const allKeys = useMemo(
    () =>
      modules.flatMap((m) =>
        m.subModules.flatMap((sm) => ACTIONS.map((a) => keyOf(sm._id, a))),
      ),
    [modules],
  );

  /* ------------------------------ edit data query --------------------------- */

  const { data: privilegeData } = useQuery({
    queryKey: ["privilegeById", privilegeId],
    queryFn: () => ListPrivilegeByIdApi(String(privilegeId)),
    enabled: open && isEdit && !!privilegeId,
  });

  const { mutate: AddPrivilege, isPending } = useAddPrivilege({ form, onOpenChange });
  const { mutate: EditPrivilege, isPending: EditPending } = useEditPrivilege({
    form,
    onOpenChange,
  });

  const roleName = form.watch("name");

  /* ---------------------------- permission state --------------------------- */

  const toggle = (key: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  const toggleMany = (keys: string[], allOn: boolean) =>
    setSelected((prev) => {
      const next = new Set(prev);
      keys.forEach((k) => (allOn ? next.delete(k) : next.add(k)));
      return next;
    });

  const allowed = allKeys.filter((k) => selected.has(k)).length;
  const allSelected = allKeys.length > 0 && allowed === allKeys.length;

  useEffect(() => {
    if (selected.size > 0) setPermissionError(false);
  }, [selected]);

  // search matches module name or submodule name
  const query = search.trim().toLowerCase();
  const visibleModules = useMemo(
    () =>
      modules
        .map((m) => ({
          module: m,
          subModules:
            !query || m.label.toLowerCase().includes(query)
              ? m.subModules
              : m.subModules.filter((s) => s.label.toLowerCase().includes(query)),
        }))
        .filter((x) => x.subModules.length > 0),
    [modules, query],
  );

  /* -------------------------------- submit --------------------------------- */

  const handleSubmit = (data: PrivilegeFormData) => {
    if (selected.size === 0) {
      setPermissionError(true);
      return;
    }

    // one entry per submodule that has at least one action turned on
    const permissions: PrivilegePermission[] = modules.flatMap((m) =>
      m.subModules
        .map((sm) => ({
          subModuleId: sm._id,
          canCreate: selected.has(keyOf(sm._id, "create")),
          canRead: selected.has(keyOf(sm._id, "view")),
          canUpdate: selected.has(keyOf(sm._id, "edit")),
          canDelete: selected.has(keyOf(sm._id, "delete")),
        }))
        .filter((p) => p.canCreate || p.canRead || p.canUpdate || p.canDelete),
    );

    // modules that have at least one submodule with a permission
    const usedSubIds = new Set(permissions.map((p) => p.subModuleId));
    const moduleIds = modules
      .filter((m) => m.subModules.some((sm) => usedSubIds.has(sm._id)))
      .map((m) => m._id);

    const payload: PrivilegePayload = {
      name: data.name,
      description: data.description,
      modules: moduleIds,
      permissions,
    };

    if (isEdit) {
      EditPrivilege({ id: String(privilegeId), value: payload });
    } else {
      AddPrivilege(payload);
    }
  };

  function onclose(value: boolean) {
    onOpenChange(value);
    if (!value) {
      form.reset({name:"",description:""});
      setSelected(new Set());
      setSearch("");
      setPermissionError(false);
    }
  }

  // fill the form when editing (API returns `subModulePermissions`)
  useEffect(() => {
    if (open && isEdit && privilegeData?.data) {
      const p = privilegeData.data;
      form.reset({ name: p.name, description: p.description ?? "" });

      const keys: string[] = [];
      ((p.subModulePermissions ?? []) as PrivilegePermission[]).forEach((perm) => {
        ACTIONS.forEach((a) => {
          if (perm[FLAG[a]]) keys.push(keyOf(perm.subModuleId, a));
        });
      });
      setSelected(new Set(keys));
    }
  }, [open, isEdit, privilegeData]);

  return (
    <Dialog open={open} onOpenChange={onclose}>
      <DialogContent
        aria-describedby={undefined}
        className="max-h-[90dvh] w-[calc(100%-2rem)] max-w-[675px] gap-0 overflow-y-auto rounded-[20px] border-0 bg-[#EFEFEF] p-4 font-poppins sm:p-6"
      >
        <DialogHeader className="text-left">
          <div className="flex items-center justify-between gap-3 pr-6">
            <DialogTitle className="text-[16px] font-semibold text-black">
              {isEdit ? "Edit access for" : "Configure access for"} {roleName.trim() || "new role"}
            </DialogTitle>
            <label className="flex shrink-0 cursor-pointer items-center gap-2 rounded-full border border-[#BDBDBD] bg-[#E9E9E9] px-3 py-1 text-[12px] font-normal text-[#848484]">
              <Radio
                checked={allSelected}
                label="Select all permissions"
                onChange={() => toggleMany(allKeys, allSelected)}
              />
              Select All
            </label>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-4 flex flex-col gap-3">
            {/* search */}
            <div className="flex h-[34px] items-center gap-2 rounded-full border border-[#D0D0D0] bg-[#E5E5E5] px-3">
              <Search className="size-[18px] shrink-0 text-[#414141]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Permissions..."
                className="w-full bg-transparent font-poppins text-[12px] text-black outline-none placeholder:text-[#848484]"
              />
            </div>

            <div className="border-t border-[#D5D5D5]" />

            {/* role name + description */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-1">
              <FormInput
                type="text"
                label="Role Name"
                name="name"
                placeholder="eg. Sales Executive"
                value={roleName}
                required
              />
              
            </div>

            {/* module cards - one card per row */}
            {isLoading ? (
              <div className="grid grid-cols-1 gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-[64px] animate-pulse rounded-[10px] bg-[#E5E5E5]" />
                ))}
              </div>
            ) : visibleModules.length === 0 ? (
              <p className="py-6 text-center text-[12px] text-[#848484]">No permissions found</p>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {visibleModules.map(({ module, subModules }) => (
                  <ModuleCard
                    key={module._id}
                    module={module}
                    subModules={subModules}
                    selected={selected}
                    forceOpen={!!query}
                    onToggle={toggle}
                    onToggleMany={toggleMany}
                  />
                ))}
              </div>
            )}

            {permissionError && (
              <p className="text-[12px] text-[#FF0000]">Select at least one permission</p>
            )}

            <DialogFooter className="mt-2">
              <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-end sm:gap-2 ">
                <Button type="button" variant="cancel" onClick={() => onclose(false)}>
                  Cancel
                </Button>
                <LoadingButton
                  type="submit"
                  variant="save"
                  loading={isEdit ? EditPending : isPending}
                  disabled={isLoading}
                >
                  {isEdit ? "Update Role" : "Save Role"}
                </LoadingButton>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}