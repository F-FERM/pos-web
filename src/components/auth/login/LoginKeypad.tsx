import { CornerDownLeft, RefreshCw } from "lucide-react";

const DIGITS = ["1", "2", "3", "4", "5", "6", "7", "8", "9"] as const;

const keyBase =
  "flex h-[45px] w-full items-center justify-center rounded-[10px] font-medium font-poppins text-[16px] shadow-[0px_0px_4px_0px_#00000040] transition-[filter,transform] active:translate-y-px active:brightness-95 disabled:cursor-not-allowed disabled:opacity-60";

interface LoginKeypadProps {
  onKey: (key: string) => void;
  onClear: () => void;
  onBackspace: () => void;
  disabled?: boolean;
}

const LoginKeypad = ({ onKey, onClear, onBackspace, disabled }: LoginKeypadProps) => {
  return (
    <div className="grid grid-cols-3 gap-[11px]">
      {DIGITS.map((k) => (
        <button
          key={k}
          type="button"
          disabled={disabled}
          onClick={() => onKey(k)}
          className={`${keyBase} bg-white text-black`}
        >
          {k}
        </button>
      ))}
      <button
        type="button"
        disabled={disabled}
        onClick={() => onKey("0")}
        className={`${keyBase} bg-white text-black`}
      >
        0
      </button>
      <button
        type="button"
        aria-label="Clear password"
        disabled={disabled}
        onClick={onClear}
        className={`${keyBase} bg-[#3D9BFF] text-white`}
      >
        <RefreshCw className="size-4" />
      </button>
      <button
        type="button"
        aria-label="Delete last digit"
        disabled={disabled}
        onClick={onBackspace}
        className={`${keyBase} bg-[#FF2F2F] text-white`}
      >
        <CornerDownLeft className="size-4" />
      </button>
    </div>
  );
};

export default LoginKeypad;