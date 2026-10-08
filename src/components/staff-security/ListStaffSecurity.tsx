"use client";

import PageHeader from "@/src/components/common/PageHeader";
import { CalendarDays, CircleCheck, KeyRound, Phone, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import employeeIcon from "../../../public/icons/staff.png"; // add your icon file
import { AddEmployeeDialog, EmployeeFormData, ROLE_OPTIONS } from "./AddStaffSecurityDialogue";
import AddEmployee from "./AddStaffSecurity";

type Employee = {
  id: string;
  code: string;
  name: string;
  phone: string;
  pin: string;
  role: string;
  joined: string; // DD/MM/YYYY
  salary: number;
};

// Dummy data (replace with API data later)
const EMPLOYEES: Employee[] = [
  { id: "1", code: "EMP-01", name: "Name", phone: "9876543210", pin: "1111", role: "Owner", joined: "01/01/2024", salary: 0 },
  { id: "2", code: "EMP-02", name: "Name", phone: "9876543211", pin: "2222", role: "Manager", joined: "15/03/2024", salary: 25000 },
  { id: "3", code: "EMP-03", name: "Name", phone: "9876543212", pin: "3333", role: "Cashier", joined: "10/06/2024", salary: 18000 },
];

const CURRENCY = "₹";

const formatToday = () => {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}/${d.getFullYear()}`;
};

const toFormData = (e: Employee): EmployeeFormData => ({
  fullName: e.name,
  phone: e.phone,
  pin: e.pin,
  role: e.role,
  salary: String(e.salary),
});

const roleLabel = (role: string) => ROLE_OPTIONS.find((r) => r.value === role)?.value ?? role;

function EmployeePage() {
  const [employees, setEmployees] = useState<Employee[]>(EMPLOYEES);
  const [addOpen, setAddOpen] = useState(false);

  // the operator currently signed in (first owner, falls back to first employee)
  const current = useMemo(
    () => employees.find((e) => e.role === "Owner") ?? employees[0],
    [employees],
  );

  const handleCreate = (data: EmployeeFormData) =>
    setEmployees((prev) => {
      const next = prev.reduce((max, e) => Math.max(max, Number(e.code.replace(/\D/g, "")) || 0), 0) + 1;
      return [
        ...prev,
        {
          id: crypto.randomUUID(),
          code: `EMP-${String(next).padStart(2, "0")}`,
          name: data.fullName,
          phone: data.phone,
          pin: data.pin,
          role: data.role,
          joined: formatToday(),
          salary: Number(data.salary) || 0,
        },
      ];
    });

  const handleUpdate = (id: string, data: EmployeeFormData) =>
    setEmployees((prev) =>
      prev.map((e) =>
        e.id === id
          ? {
              ...e,
              name: data.fullName,
              phone: data.phone,
              pin: data.pin,
              role: data.role,
              salary: Number(data.salary) || 0,
            }
          : e,
      ),
    );

  return (
    <div className="flex flex-col gap-3 lg:px-2">
      <PageHeader
        title="Employee Management & Role Security"
        subtitle="Configure Staff Roles, 4-digit security PIN access, and switch active thermal operators"
        icon={employeeIcon}
        actions={[
          {
            label: "Add New Staff Member",
            icon: <Plus />,
            onClick: () => setAddOpen(true),
          },
        ]}
      />

      {/* Current operator */}
      {current && (
        <section className="flex flex-col gap-3 rounded-[10px] bg-[#EFEFEF] px-4 py-4 font-poppins sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-[35px] shrink-0 items-center justify-center rounded-[5px] bg-[#F24DEB33] text-[16px] font-medium text-[#F24DEB]">
              {current.name.charAt(0).toUpperCase()}
            </span>
            <div className="flex min-w-0 flex-col gap-[4px]">
              <span className="inline-flex h-[16px] w-fit items-center rounded-full border border-[#F24DEB] bg-[#FF00F50D] px-4 text-[10px] uppercase leading-none text-[#F24DEB]">
                Current Section
              </span>
              <h2 className="truncate text-[16px] font-semibold leading-[1.2] text-black">
                {current.name}{" "}
                <span className="font-normal text-[#585858]">({current.role})</span>
              </h2>
              <p className="flex items-center gap-1 text-[11px] leading-[1.3] text-[#6B6B6B]">
                <CircleCheck className="size-[12px] shrink-0" />
                Role: {current.role}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:items-end">
            <p className="text-[13px] text-[#848484]">PIN Protection Active</p>
            <span className="w-fit rounded-[5px] bg-[#D5D5D5] px-3 py-[2px] text-[11px] text-[#F24DEB]">
              PIN: ****
            </span>
          </div>
        </section>
      )}

      {/* Employee cards: 1 column on phones, 2 from sm, 3 from xl */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {employees.map((e) => (
          <article
            key={e.id}
            className="flex min-w-0 flex-col gap-[6px] rounded-[10px] border border-[#A8A8A8] bg-[#EFEFEF] px-[15px] pb-[13px] pt-[14px] font-poppins"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex min-w-0 flex-col gap-[5px]">
                 <span className="inline-flex h-[16px] w-fit items-center rounded-full border border-[#ACACAC] bg-[#BFBFBF40] px-2 text-[10px] leading-none text-[#585858]">
                    {e.code}
                  </span>
                <h3 className="truncate text-[14px] font-semibold leading-[1.3] text-black" title={e.name}>
                  {e.name}{" "}
                  <span className="font-normal text-[#585858]">({e.role.toLowerCase()})</span>
                </h3>
                <span className="inline-flex h-[17px] w-fit items-center rounded-[5px] border border-[#F24DEB] bg-[#FF00F50D] px-3 text-[10px] leading-none text-primary">
                  {roleLabel(e.role)}
                </span>
              </div>

              <div className="flex shrink-0 items-center gap-1">
                <AddEmployee
                  isEdit
                  id={e.id}
                  employee={toFormData(e)}
                  onSubmit={(data) => handleUpdate(e.id, data)}
                />
              </div>
            </div>

            <ul className="flex flex-col gap-[6px] border-t border-[#BDBDBD] pt-[8px] text-[12px] leading-[1.3] text-[#6B6B6B]">
              <li className="flex items-center gap-2">
                <Phone className="size-[13px] shrink-0" />
                <span className="truncate">+91 {e.phone}</span>
              </li>
              <li className="flex items-center gap-2">
                <CalendarDays className="size-[13px] shrink-0" />
                <span className="truncate">Joined: {e.joined}</span>
              </li>
              <li className="flex items-center gap-2">
                <KeyRound className="size-[13px] shrink-0" />
                <span className="truncate">PIN: {e.pin}</span>
              </li>
            </ul>

            <div className="mt-auto border-t border-[#BDBDBD] pt-[6px] text-[12px] text-black">
              Monthly Salary: {CURRENCY} {e.salary}
            </div>
          </article>
        ))}
      </section>

      <AddEmployeeDialog open={addOpen} onOpenChange={setAddOpen} onSubmit={handleCreate} />
    </div>
  );
}

export default EmployeePage;